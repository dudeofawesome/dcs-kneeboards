#!/usr/bin/env ruby

if RUBY_PLATFORM.include?('linux')
  chrome_path = '/usr/bin/google-chrome-stable'
elsif RUBY_PLATFORM.include?('darwin')
  chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
else
  throw "Unknown platform #{RUBY_PLATFORM}"
end

# ensure public dir exists
Dir.mkdir('public') if !Dir.exist?('public')

scss_var_file = File.read('src/styles/_variables.scss')
page_width_matches = /page-width: (\d+)([a-zA-Z]*);/.match(scss_var_file)
page_height_matches = /page-height: (\d+)([a-zA-Z]*);/.match(scss_var_file)

dpi = 100
px_width = page_width_matches.captures[0].to_i || 1100
px_height = page_height_matches.captures[0].to_i || 1600
phy_width = px_width / dpi
phy_height = px_height / dpi

puts '[START HTTP SERVER]'
# @type [IO]
http_server = IO.popen('npm run start')

while !http_server.gets.include?('ready - started server on')
  sleep 1
end

puts '[CAPTURE WEBSITE PDF]'
begin
  `chrome-headless-render-pdf --chrome-binary "#{chrome_path}" --chrome-option "--no-sandbox" --url "http://localhost:3000" --no-margins --include-background --window-size #{px_height}x#{px_width} --paper-height #{phy_height} --paper-width #{phy_width} --page-ranges 1 --pdf "public/Louis Orleans' Résumé.pdf"`
rescue
  throw 'Failed to render PDF!'
end

puts '[STOP HTTP SERVER]'
Process.kill("TERM", http_server.pid)

puts '[DONE]'
