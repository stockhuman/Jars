window.api = null
window.dob = '01/01/1990'


// Util tests
describe('Utils', () => {
  describe('isValidAPIDate', () => {
    context('with an improperly formatted date', () => {
      it('should return false given "12.04.98"', () => {
        assert.equal(isValidAPIDate('12.04.98'), false)
      })
      it('should return false given "12041998"', () => {
        assert.equal(isValidAPIDate('12041998'), false)
      })
    })

    context('with an impossible date', () => {
      it('should return false', () => {
        assert.equal(isValidAPIDate('00000000'), false)
      })
    })

    context('with a number as input', () => {
      it('should return true', () => {
        assert.equal(isValidAPIDate(20190304), true)
      })
    })

    context('with no arguments', () => {
      it('should return false', () => {
        assert.equal(isValidAPIDate(), false)
      })
    })
    context('with a Date object as argument', () => {
      it('should return false', () => {
        assert.equal(isValidAPIDate(new Date()), false)
      })
    })
  })

  describe('YYYYMMDD', () => {
    it('should return a valid API date given no arguments', () => {
      assert.equal(isValidAPIDate(YYYYMMDD()), true)
    })
    it('should return an already valid date if passed one', () => {
      assert.equal(YYYYMMDD('20070403'), '20070403')
    })
    it('should return a valid date if passed a Date object', () => {
      assert.equal(YYYYMMDD(new Date('05/04/2008')), '20080504')
    })
    it(`should return today's valid API date given invalid input`, () => {
      assert.equal(YYYYMMDD(undefined), YYYYMMDD())
    })
  })

  describe('filterFloat', () => {
    it('should return the Number zero given 0', () => {
      assert.equal(filterFloat('0'), 0)
    })
    it(`should return the Number one given 1`, () => {
      assert.equal(filterFloat('1'), 1)
    })
    it('should return a Number give its string representation', () => {
      assert.equal(filterFloat('20070403'), 20070403)
    })
    it('should return NaN with no input', () => {
      assert.equal(isNaN(filterFloat()), isNaN(NaN))
    })
    it(`should return a Number given a Number`, () => {
      assert.equal(filterFloat(12.7), 12.7)
    })
    it(`should zero-pad a Number beggining with a period`, () => {
      assert.equal(filterFloat(.5), 0.5)
    })
    it(`should return NaN with undefined input`, () => {
      assert.equal(isNaN(filterFloat(undefined)), isNaN(NaN))
    })
  })
})

// Log tests
describe('log.assure', () => {

  const log = new LogForm({ root: document.getElementById('log-root') })

  beforeEach(() => {
    // runs before each test in this block
    log.state.commit = {
      date: YYYYMMDD(),
      hours: '1',
      tod: 'm',
      project: 'projett',
      task: 'code',
      category: 'cat-egg'
    }
  })

  context('with a valid commit', () => {
    it('should return true', () => {
      assert.equal(log.assure(), true)
    })
  })

  context('with an invalid commit', () => {

    it('should return false with bad hours', () => {
      log.state.commit.hours = undefined
      assert.equal(log.assure(), false)
    })

    it('should return false with bad date', () => {
      log.state.commit.date = 5609451
      assert.equal(log.assure(), false)
    })

    it('should return false with no project', () => {
      log.state.commit.project = ''
      assert.equal(log.assure(), false)
    })
  })
})
// end log tests
