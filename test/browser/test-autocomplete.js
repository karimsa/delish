/*import expect from 'expect'

describe('test autocomplete', function () {
  this.timeout(30000)

  const ti = (name, test) => it(name, async () => {
    try {
      await test()
    } catch (err) {
      console.log(await browser.getPageSource())

      const elm = element(by.className('error-msg'))

      if (elm.isPresent()) {
        throw new Error(elm.getText())
      }

      throw err
    }
  })

  beforeEach(async function () {
    browser.ignoreSynchronization = true
    browser.get('http://localhost:8080/')
    await browser.getTitle()
  })

  ti('should have a title', async function () {
    expect(await browser.getTitle()).toEqual('DELISH')
  })
})*/