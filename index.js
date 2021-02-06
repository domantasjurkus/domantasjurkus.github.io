const entries = [
  {
    href: "https://github.com/domantasjurkus",
    textPreAt: "8 stars",
    textPostAt: "github.com",
    colorTextFont: "#000",
    colorTextBackground: "#f8f8f8",
    colorAtFont: "#fff",
    colorAtBackground: "#24292e",
    colorBorder: "#333",
  },
  {
    href: "https://www.hacker.org/forum/profile.php?mode=viewprofile&u=34375",
    textPreAt: "122 solved",
    textPostAt: "hacker.org",
    colorTextFont: "#d5f0de",
    colorTextBackground: "#181818",
    colorAtFont: "#181818",
    colorAtBackground: "#d5f0de",
    colorBorder: "#181818",
  },
  {
    href: "https://projecteuler.net/",
    textPreAt: "50 solved",
    textPostAt: "projecteuler.net",
    colorTextFont: "#000",
    colorTextBackground: "#f8f8f8",
    colorAtFont: "#fff",
    colorAtBackground: "#f93",
    colorBorder: "#333",
  },
  {
    href: "https://devpost.com/domantasjurkus?ref_content=user-portfolio",
    textPreAt: "10 projects",
    textPostAt: "devpost.com",
    colorTextFont: "#000",
    colorTextBackground: "#f8f8f8",
    colorAtFont: "#fff",
    colorAtBackground: "#67cae3",
    colorBorder: "#333",
  },
  {
    href: "https://www.setlist.fm/user/daRealDodo",
    textPreAt: "72 concerts",
    textPostAt: "setlist.fm",
    colorTextFont: "#fff",
    colorTextBackground: "#85b146",
    colorAtFont: "#000",
    colorAtBackground: "#eee",
    colorBorder: "#85b146",
  },
  {
    href: "https://tutorful.co.uk/tutors/nnn5qwpl",
    textPreAt: "15+ hours",
    textPostAt: "tutorful.co.uk",
    colorTextFont: "#000",
    colorTextBackground: "#f8f8f8",
    colorAtFont: "#fff",
    colorAtBackground: "#4cbcc2",
    colorBorder: "#333",
  },
  {
    href: "https://www.superprof.co.uk/jack-all-trades-web-development-python-security-looking-forward-new-challenges.html",
    textPreAt: "9 reviews",
    textPostAt: "superprof.co.uk",
    colorTextFont: "#fff",
    colorTextBackground: "#fa6484",
    colorAtFont: "#000",
    colorAtBackground: "#fafafa",
    colorBorder: "#fa6484",
  },
  {
    href: "https://news.ycombinator.com/user?id=daRealDodo",
    textPreAt: "26 karma",
    textPostAt: "hacker.news",
    colorTextFont: "#fff",
    colorTextBackground: "#ff6600",
    colorAtFont: "#000",
    colorAtBackground: "#f6f6ef",
    colorBorder: "#fa6484",
  }
]

function decorate(entry) {
  const badgeElementStyle = `font-size: 14px;display: inline-block;background:${entry.colorTextBackground};color:${entry.colorTextFont};margin: 5px 5px;padding: 0 10px;border-radius: 20px;border:1px solid ${entry.colorBorder};`
  const atElementStyle = `display:inline-block;margin:0 3px;min-width:22px;border-radius:50px;background:${entry.colorAtBackground};color:${entry.colorAtFont};text-align:center;text-decoration:none`

  const preAtElement = `<span>${entry.textPreAt}</span>`
  const atElement = `<span style="${atElementStyle}">@</span>`
  const postAtElement = `<span>${entry.textPostAt}</span>`
  const textElement = `${preAtElement}${atElement}${postAtElement}`
  const badgeElement = `<div style="${badgeElementStyle}">${textElement}</div>`

  const aElement = document.createElement("a")
  aElement.href = entry.href
  aElement.innerHTML = badgeElement

  document.getElementById("badges").appendChild(aElement)
}

entries.forEach(entry => {
  decorate(entry)
})