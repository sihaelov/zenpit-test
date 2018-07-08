// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'basic view': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.home')
      .assert.elementCount('.device-list', 1)
      .assert.elementCount('input', 2)
      .waitForElementVisible('.device', 20000)
      .assert.elementCount('.device', 100)
  },

  'search': (browser) => {
    browser
      .setValue('input[placeholder=Brand]', 'Apple')
      .setValue('input[placeholder=Device]', 'X')
      .click('button[type=submit]')
      .waitForElementVisible('.device', 20000)
      .assert.elementCount('.device', 1)
      .assert.containsText('.device > p:first-child', '2017, September')
  },

  'device details': (browser) => {
    browser
      .click('.device')
      .waitForElementVisible('.el-dialog__wrapper', 5000)
      .assert.elementCount('.el-dialog__title', 1)
      .assert.containsText('.el-dialog__title', 'Apple iPhone X')
      .assert.elementPresent('.el-dialog__headerbtn')
      .assert.elementPresent('.el-dialog__body')
      .assert.elementCount('.el-dialog__body > p', 58)
      .assert.containsText('.el-dialog__body > p:nth-child(2)', 'Brand: Apple')
      .click('.el-dialog__headerbtn')
      .waitForElementNotPresent('.el-dialog__wrapper', 5000)
      .end();
  },
};
