# Minimal static file server for local preview (no Node/Python needed).
param([int]$Port = 5173)
$root = Split-Path -Parent $PSScriptRoot
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='text/javascript'; '.json'='application/json';
  '.svg'='image/svg+xml'; '.webp'='image/webp'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png';
  '.mp4'='video/mp4'; '.webmanifest'='application/manifest+json'; '.xml'='application/xml'; '.txt'='text/plain' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Serving $root on http://localhost:$Port/"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = Join-Path $root $path
    if ((Test-Path $file -PathType Container)) { $file = Join-Path $file 'index.html' }
    if (-not (Test-Path $file -PathType Leaf) -and (Test-Path "$file.html")) { $file = "$file.html" }
    if (Test-Path $file -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $res.ContentType = $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
      $bytes = [IO.File]::ReadAllBytes($file)
      $res.Headers.Add('Accept-Ranges', 'bytes')
      $range = $ctx.Request.Headers['Range']
      if ($range -and $range -match 'bytes=(\d*)-(\d*)') {
        $start = if ($matches[1]) { [long]$matches[1] } else { 0 }
        $end = if ($matches[2]) { [long]$matches[2] } else { $bytes.Length - 1 }
        if ($end -ge $bytes.Length) { $end = $bytes.Length - 1 }
        $len = $end - $start + 1
        $res.StatusCode = 206
        $res.Headers.Add('Content-Range', "bytes $start-$end/$($bytes.Length)")
        $res.ContentLength64 = $len
        $res.OutputStream.Write($bytes, [int]$start, [int]$len)
      } else {
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $res.StatusCode = 404
      $nf = Join-Path $root '404.html'
      $b = [IO.File]::ReadAllBytes($nf)
      $res.ContentType = 'text/html; charset=utf-8'
      $res.OutputStream.Write($b, 0, $b.Length)
    }
  } catch { } finally { try { $res.OutputStream.Close() } catch { } }
}
