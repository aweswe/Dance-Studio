Add-Type -AssemblyName System.IO.Compression.FileSystem
$docx = 'extracted_assets/2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001/2026 NEW Website Galley and Canada workshops/Main page.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docx)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$text = $xml -replace '<[^>]+>', ' ' -replace '\s+', ' '
[System.IO.File]::WriteAllText('scripts/docx-extracted-text.txt', $text)
Write-Host ("Extracted text length: " + $text.Length)
