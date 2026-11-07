Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "Frontend\public\HireCraft-Favicon.jfif"
$pubPath = Join-Path $PSScriptRoot "Frontend\public"

$srcImage = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Bitmap([System.Drawing.Image]$source, [int]$width, [int]$height) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $bmp.SetResolution($source.HorizontalResolution, $source.VerticalResolution)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($source, 0, 0, $width, $height)
    $g.Dispose()
    return $bmp
}

# Generate PNGs
$sizes = @(16, 32, 48, 180, 192)
$bitmaps = @{}

foreach ($s in $sizes) {
    $bmp = Resize-Bitmap $srcImage $s $s
    $outName = "favicon-${s}x${s}.png"
    if ($s -eq 180) { $outName = "apple-touch-icon.png" }
    $bmp.Save((Join-Path $pubPath $outName), [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmaps[$s] = $bmp
}

# Build valid multi-resolution ICO file with 16, 32, 48
$icoSizes = @(16, 32, 48)
$pngDataList = @()

foreach ($s in $icoSizes) {
    $ms = New-Object System.IO.MemoryStream
    $bitmaps[$s].Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngDataList += ,@($s, $ms.ToArray())
    $ms.Dispose()
}

$icoFile = Join-Path $pubPath "favicon.ico"
$stream = [System.IO.File]::Create($icoFile)
$writer = New-Object System.IO.BinaryWriter($stream)

# ICONDIR header
$writer.Write([uint16]0) # Reserved
$writer.Write([uint16]1) # ICO type
$writer.Write([uint16]$pngDataList.Count) # Image count

$offset = 6 + (16 * $pngDataList.Count)

foreach ($item in $pngDataList) {
    $size = $item[0]
    $data = $item[1]
    
    # ICONDIRENTRY
    $writer.Write([byte]$size)              # Width
    $writer.Write([byte]$size)              # Height
    $writer.Write([byte]0)                  # Color count
    $writer.Write([byte]0)                  # Reserved
    $writer.Write([uint16]1)                # Color planes
    $writer.Write([uint16]32)               # Bits per pixel
    $writer.Write([uint32]$data.Length)     # Image size
    $writer.Write([uint32]$offset)          # Offset
    
    $offset += $data.Length
}

# Write PNG data for each icon
foreach ($item in $pngDataList) {
    $writer.Write($item[1])
}

$writer.Flush()
$stream.Close()

$srcImage.Dispose()
foreach ($bmp in $bitmaps.Values) {
    $bmp.Dispose()
}

Write-Output "Successfully generated favicons and multi-resolution ICO."
