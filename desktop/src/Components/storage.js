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
  async get (query) {
    switch (window.store) {
      case 'CRUD': return await this._CRUDGet(query)
      case 'local':
      default: return this._localGet(query)
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
      case 'local': return this._localUpdate(id, data)
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

  
  _localGet(query) {
    const splitq = query.split(',')
    const type = splitq[1]
    const start = splitq[2]

    let array = []

    if (type == 'eq') { // exact date match
			let keys = Object.keys(localStorage)
			keys = keys.filter(key => key.startsWith(YYYYMMDD(start)))
			keys.forEach(key => {
				array.push(JSON.parse(localStorage.getItem(key)))
			})
    } else if (type == 'bt') { // range
      let end = splitq[3]
      end = parseInt(end.split('&')[0]) // remove extra qparams
    
      let i = parseInt(start)
      
      // iterate 
      while (i <= end) {
        let item = localStorage.getItem(i)
        if (item) array.push(JSON.parse(item))
        i++
      }
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
