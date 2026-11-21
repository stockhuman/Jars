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

  
  /**
   * Answers the same PHP-CRUD-API style filters the server does, from
   * localStorage: `filter=<field>,eq,<value>` and `filter=<field>,bt,<from>,<to>`.
   * Logs live under `YYYYMMDD-hash` keys, so a day can hold several of them.
   */
  _localGet(query, withKey) {
    const filter = /filter=([^&]*)/.exec(query)
    if (!filter) return []
    const [field, type, ...values] = filter[1].split(',').map(decodeURIComponent)

    const matches = value => {
      if (type == 'eq') return value == values.join(',')
      if (type == 'bt') return value >= values[0] && value <= values[1]
      return false
    }

    return Object.keys(localStorage)
      .filter(key => /^\d{8}-/.test(key)) // skip the config and other settings
      .map(key => [key, JSON.parse(localStorage.getItem(key))])
      .filter(([, log]) => matches(String(log[field])))
      .sort(([, a], [, b]) => String(a.date).localeCompare(String(b.date)))
      .map(entry => withKey ? entry : entry[1])
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
}
