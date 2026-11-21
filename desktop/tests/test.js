window.api = null
window.dob = '01/01/1990'
window.store = 'local'
// the components read their strings from here; test in English
window.localeStrings = window.defaultLocaleStrings = require('../src/locales/en.json')


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

describe('escapeHTML', () => {
  it('escapes markup and quotes', () => {
    assert.equal(escapeHTML(`<b class="x">R&D's</b>`), '&lt;b class=&quot;x&quot;&gt;R&amp;D&#39;s&lt;/b&gt;')
  })
  it('turns missing values into an empty string', () => {
    assert.equal(escapeHTML(undefined), '')
    assert.equal(escapeHTML(null), '')
  })
})

describe('TODfromTimestamp', () => {
  const s1 = window.localeStrings.logform.s1
  it('files late-evening work under night', () => {
    assert.equal(TODfromTimestamp('22:30:00', 1, s1), 'n')
  })
  it('wraps work that started before midnight', () => {
    // six hours ending at 1am are centred on 10pm
    assert.equal(TODfromTimestamp('01:00:00', 6, s1), 'n')
  })
  it('still finds the morning', () => {
    assert.equal(TODfromTimestamp('09:00:00', 1, s1), 'm')
  })
})

describe('StorageHandler (local mode)', () => {
  const storage = new StorageHandler()
  const log = (date, project) => ({ date, hours: '1', tod: 'm', project, task: 't', category: 'c', comment: '' })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('config', '{}') // not a log, must be skipped
    await storage.set(log('20200105', 'Jars'))
    await storage.set(log('20200105', 'R&D, misc'))
    await storage.set(log('20200110', 'Jars'))
    await storage.set(log('20200301', 'Jars'))
  })
  after(() => localStorage.clear())

  it('returns every log on a day that has several', async () => {
    assert.equal((await storage.get('?filter=date,eq,20200105')).length, 2)
    assert.equal((await storage.get('?filter=date,bt,20200101,20200131')).length, 3)
  })

  it('returns logs oldest first', async () => {
    const logs = await storage.get('?filter=date,bt,20200101,20201231')
    assert.deepEqual(logs.map(l => l.date), ['20200105', '20200105', '20200110', '20200301'])
  })

  it('filters on other fields, with URL-encoded values', async () => {
    const logs = await storage.get(`?&filter=project,eq,${encodeURIComponent('R&D, misc')}`)
    assert.equal(logs.length, 1)
    assert.equal(logs[0].project, 'R&D, misc')
  })

  it('finds an edited log on its new date', async () => {
    const [[key, entry]] = await storage.get('?filter=date,eq,20200301', true)
    await storage.update(key, { ...entry, date: '20200102' })
    assert.equal((await storage.get('?filter=date,eq,20200102')).length, 1)
    assert.equal((await storage.get('?filter=date,eq,20200301')).length, 0)
  })
})

describe('Calendar', () => {
  it('keeps days selectable after re-rendering', () => {
    const cal = new Calendar({ root: document.getElementById('cal-root'), info: document.getElementById('cal-info') })
    cal.today() // re-renders, like the midnight roll-over does

    let selected = null
    const onSelect = e => { selected = e.detail }
    document.addEventListener('calendar-select', onSelect)
    cal.root.querySelector('.graph rect:not(.null)').dispatchEvent(new FocusEvent('focus'))
    document.removeEventListener('calendar-select', onSelect)

    assert.ok(selected, 'no calendar-select event')
  })
})

describe('Header', () => {
  const root = document.getElementById('header-root')
  const fill = () => Number(root.querySelector('#clippath rect').getAttribute('width'))

  beforeEach(() => { root.innerHTML = '' })
  after(() => localStorage.removeItem('dob'))

  it('fills half the logo at 40', () => {
    const born = new Date()
    born.setFullYear(born.getFullYear() - 40)
    localStorage.setItem('dob', born.toDateString())
    new Header({ root })
    assert.ok(Math.abs(fill() - 64) < 1, `filled ${fill()} of 128`)
  })

  it('copes without a birthday', () => {
    localStorage.setItem('dob', 'undefined') // what Config stores when it's missing
    new Header({ root })
    assert.equal(fill(), 0)
    assert.ok(!root.querySelector('.fraction').textContent.includes('NaN'))
  })
})

describe('pirate.json', () => {
  it('has every string en.json has, and the same time-of-day codes', () => {
    const en = require('../src/locales/en.json')
    const pirate = require('../src/locales/pirate.json')
    const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) =>
      v && typeof v === 'object' && !Array.isArray(v) ? [p + k, ...keys(v, `${p}${k}.`)] : [p + k])
    assert.deepEqual(keys(pirate).sort(), keys(en).sort())
    assert.deepEqual(pirate.logform.s1.values.map(v => v.abbr), en.logform.s1.values.map(v => v.abbr))
  })
})
