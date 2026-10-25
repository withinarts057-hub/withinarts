Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\msaad\.gemini\antigravity-ide\brain\305126c3-fcb1-438b-bf5d-f050ab7e0cab\crop_top_left.png'
$bmp = [System.Drawing.Image]::FromFile($imgPath)
$rect = New-Object System.Drawing.Rectangle(30, 70, 30, 30)
$zoom = New-Object System.Drawing.Bitmap(150, 150)
$g = [System.Drawing.Graphics]::FromImage($zoom)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0,0,150,150)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Dispose()
$outPath = 'C:\Users\msaad\.gemini\antigravity-ide\brain\305126c3-fcb1-438b-bf5d-f050ab7e0cab\zoom_icon.png'
$zoom.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$zoom.Dispose()
Write-Output "Saved zoom icon"
