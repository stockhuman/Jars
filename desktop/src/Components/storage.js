/**
 * Abstracts all storage methods
 */
class StorageHandler {
  constructor() {
    if (!window.api && window.store != 'local') {
      window.location.href = 'setup.html'
    }
    if (window.api && window.store != 'local') {
      window.store = 'CRUD' // compatibility with old settings files
    }
  }

  /**
   * A query can look like:
   * [URL]&filter=date,bt,[start],[end]&exclude=[ID,comment,task]
   * @param {string} query PHP-CRUD-API formatted string
   * @returns {Array} Array of commits
   */
  async get (query, withKey = false) {
    switch (window.store) {
      case 'CRUD': return await this._CRUDGet(query)
      case 'local':
      default: return this._localGet(query, withKey)
    }
  }

  async set (commit) {
    switch (window.store) {
      case 'CRUD': return this._CRUDSet(commit)
      case 'local':
      default: return this._localSet(commit)
    }
  }

  async update (id, data) {
    switch (window.store) {
      case 'CRUD': return this._CRUDUpdate(id, data)
      case 'local':
      default: return this._localUpdate(id, data)
    }
  }

  async _CRUDGet(query) {
    let data = await fetch(window.api + query)
      .then(r => r.json())
      .catch(e => { console.warn(e); return null })
    return data.records
  }

  _CRUDSet(commit){
    return fetch(window.api, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commit)
    })
  }

  _CRUDUpdate (id, log) {
    return fetch(`${window.api}/${id}` , {
			method: 'PUT',
			// 	mode: 'cors', // no-cors, cors, *same-origin
			// 	credentials: 'same-origin', // include, *same-origin, omit
			headers: { 'Content-Type': 'application/json' },
			referrer: 'no-referrer',
			body: JSON.stringify(log),
		})
  }

  
  _localGet(query, withKey) {
    const splitq = query.split(',')
    const type = splitq[1]
    const start = splitq[2]

    let array = []
    let keys = Object.keys(localStorage)

    if (type == 'eq') { // exact date match
			keys = keys.filter(key => key.startsWith(YYYYMMDD(start)))
			keys.forEach(key => {
        if (withKey) {
          array.push([key, JSON.parse(localStorage.getItem(key))])
        } else {
          array.push(JSON.parse(localStorage.getItem(key)))
        }
			})
    } else if (type == 'bt') { // range
      // Since local keys are indexed as `date-hash`, to avoid overwriting
      // in case of multiple entries per day, we do this little dance.
      // This could be avoided by making entries a date-indexed array
      // that contains the day's commits, but this introduces a greater
      // discrepancy between storage modes architecturally.
      // A final goal of this system is to be able to transition between modes
      // with a simple programmatic conversion.
      let end = splitq[3]
      end = end.split('&')[0] // remove extra qparams
      
			this.getDaysArray(start, end).forEach(day => {
        let match = keys.filter(item => item.startsWith(day))
        let lsm = localStorage.getItem(match)
        if (lsm) {
          if (withKey) {
            array.push([match, JSON.parse(lsm)])
          } else {
            array.push(JSON.parse(lsm))
          }
        }
			})
    }

    return array
  }

  /** `ID` = YYYYMMDD-(hash(commit)).subString(0, 5) */
  _localSet(commit) {
    let hash = this.hash(JSON.stringify(commit))
    let id = `${commit.date}-${hash.toString().substring(0, 5)}`
    localStorage.setItem(id, JSON.stringify(commit))
  }

  _localUpdate(id, log) {
    localStorage.setItem(id, JSON.stringify(log))
  }

  // via
  hash(string) {
    let hash = 0, i, chr;
    for (i = 0; i < string.length; i++) {
      chr   = string.charCodeAt(i)
      hash  = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  /**
   * returns an array of YYYYMMDD formatted dates between `start` and `end`
   * @param {string} start YYYYMMDD date string
   * @param {string} end YYYYMMDD date string
   */
  getDaysArray (start, end) {
    const toISO = (date) => {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      return `${year}-${month}-${day}T12:00:00Z` // time to correct for DST
    }

    let arr = []
    end = new Date(toISO(end))
    start = toISO(start)

    // off by one error correction
    end = end.setDate(end.getDate() + 1)

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt))
    }

    return arr.map(el => YYYYMMDD(el))
  }
}
