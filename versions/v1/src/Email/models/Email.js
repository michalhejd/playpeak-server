export function verificationTemplate (name, code, url) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verifikace emailu</title>
      </head>
      <body>
        <p>Ahoj ${name},</p>
        <p>pro dokončení registrace na SSPŠ Gaming zadej následující kód:<br><strong>${code}</strong> <i>(kód je platný 10 minut)</i></p>
        <p>Nebo klikni na následující odkaz:<br><a href="${url}">${url}</a></p>
        <p>Pokud jsi se nezaregistroval na SSPŠ Gaming, tento email ignoruj.</p>
        <p>S pozdravem,<br>SSPŠ Gaming</p>
      </body>
    </html>
    `
}