import * as Bowser from 'bowser'

const browser = Bowser.parse(window.navigator.userAgent)

export const aes192 = browser.engine.name !== 'Blink'
