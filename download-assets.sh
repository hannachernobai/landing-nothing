#!/usr/bin/env bash
# Запускати з папки landing-nothing:  bash download-assets.sh
# Посилання Figma діють 7 днів і є тимчасовими, у репозиторій цей файл не додавати.
set -e

mkdir -p images-src ../_figma-assets

get() {
  curl -fL --retry 3 --silent --show-error -o "$1" "$2"
  echo "OK  $1"
}

P=https://www.figma.com/api/mcp/asset/7ee55bf4-1b54-4c3c-9f06-5b0ffa2feae6
A=https://www.figma.com/api/mcp/asset

# Фото (оригінали з макета) у images-src
get images-src/hero.png       "$P/0d78e.png"
get images-src/product-1.png  "$P/f523d.png"
get images-src/product-2.png  "$P/70c9f.png"
get images-src/product-3.png  "$P/08951.png"
get images-src/category-1.png "$P/1227b.png"
get images-src/category-2.png "$P/a9676.png"
get images-src/category-3.png "$P/8908a.png"
get images-src/category-4.png "$P/b5df1.png"
get images-src/category-5.png "$P/955dc.png"
get images-src/category-6.png "$P/eae08.png"
get images-src/banner.png     "$P/3b35b.png"

# Допоміжні файли поза репозиторієм
get ../_figma-assets/hero-source.png "$A/a86d2155-296d-4e5f-8d75-20f38956f939/09192.png"
get ../_figma-assets/icon-phone.svg        "$A/9b1fadd7-42cf-4e02-9b19-ce3481dd1c0c.svg"
get ../_figma-assets/icon-burger.svg       "$A/966cb022-82e7-44d4-8776-955718244128.svg"
get ../_figma-assets/icon-burger-hover.svg "$A/b28ccae5-c535-4f91-b526-97d0577b2080.svg"
get ../_figma-assets/icon-close.svg        "$A/c2a6a8bb-22f6-458a-97bd-d5f823877640.svg"
get ../_figma-assets/logo-raw-1.png        "$A/f1f98dd0-5983-4176-8bf0-c37e7ddfcac5"
get ../_figma-assets/logo-raw-2.png        "$A/cd5a7c4d-783b-4651-a81e-67077408c570"

echo
echo "Розміри зображень:"
file images-src/*.png ../_figma-assets/*.png | sed 's/,.*bit.*//' 
echo
echo "Вміст іконок:"
for f in ../_figma-assets/icon-*.svg; do echo "--- $f"; cat "$f"; echo; done
