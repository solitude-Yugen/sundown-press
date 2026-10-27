$lines = Get-Content 'style.css'

function Extract([int]$from, [int]$to, [string]$out) {
    $nl = [System.Environment]::NewLine
    $content = $lines[($from-1)..($to-1)] -join $nl
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $out), $content, [System.Text.Encoding]::UTF8)
    Write-Host "Written: $out"
}

# base: vars + reset + canvas + particles overlay (1-109)
Extract 1 109 'css/base.css'
# preloader (111-193)
Extract 111 193 'css/preloader.css'
# navigation (194-435)
Extract 194 435 'css/navigation.css'
# hero section (436-1404)
Extract 436 1404 'css/hero.css'
# carousel + marquee + shared sections (1405-1499)
Extract 1405 1499 'css/carousel.css'
# digital greetings (1500-1610)
Extract 1500 1610 'css/greetings.css'
# how-it-works full section (1611-2881)
Extract 1611 2881 'css/how-it-works.css'
# persistent CTA (2882-3010)
Extract 2882 3010 'css/persistent-cta.css'
# parallax dividers (3011-3093)
Extract 3011 3093 'css/parallax.css'
# keepsakes (3094-3262)
Extract 3094 3262 'css/keepsakes.css'
# weddings (3263-3414)
Extract 3263 3414 'css/weddings.css'
# photobooth (3415-3550)
Extract 3415 3550 'css/photobooth.css'
# testimonials (3551-3624)
Extract 3551 3624 'css/testimonials.css'
# contact (3625-3699)
Extract 3625 3699 'css/contact.css'
# footer (3700-3787)
Extract 3700 3787 'css/footer.css'
# responsive (3860-4164)
Extract 3860 4164 'css/responsive.css'

Write-Host 'Done splitting style.css into partials!'
