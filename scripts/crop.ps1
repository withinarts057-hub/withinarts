Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\msaad\.gemini\antigravity-ide\brain\305126c3-fcb1-438b-bf5d-f050ab7e0cab\.user_uploaded\media_1792672287961.png'
$bmp = [System.Drawing.Image]::FromFile($imgPath)
Write-Output "Image dimensions: $($bmp.Width) x $($bmp.Height)"
$rect = New-Object System.Drawing.Rectangle(0, 0, 120, 120)
$crop = New-Object System.Drawing.Bitmap(120, 120)
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.DrawImage($bmp, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$bmp.Dispose()
$outPath = 'C:\Users\msaad\.gemini\antigravity-ide\brain\305126c3-fcb1-438b-bf5d-f050ab7e0cab\crop_top_left.png'
$crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose()
Write-Output "Saved crop to $outPath"
