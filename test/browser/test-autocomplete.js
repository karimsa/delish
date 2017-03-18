import expect from 'expect'

describe('test autocomplete', () => {
  beforeEach(() => {
    browser.ignoreSynchronization = true
    browser.get('http://localhost:8080/')
  })

  it('should have a title', done => {
    browser.getTitle().then(title => {
      expect(title).toEqual('DELISH')
      done()
    })
  })
})