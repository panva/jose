import * as Bowser from 'bowser'

const browser = Bowser.parse(window.navigator.userAgent)

export const p521 = browser.engine.name !== 'WebKit' || (browser.browser.name === 'Safari' && parseInt(browser.browser.version, 10) >= 15) || (browser.os.name === 'iOS' && parseInt(browser.os.version, 10) >= 15)
export const ecPkcs8 = browser.browser.name !== 'Firefox' || parseInt(browser.browser.version, 10) >= 93
export const aes192 = browser.engine.name !== 'Blink'
