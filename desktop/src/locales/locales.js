/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
import config from '../config.json'

import en from './en.json' // English, CA, defaults
import es from './es.json' // Spanish, not specified
import fr from './fr.json' // French, not specified
import de from './de.json' // German, International
import it from './it.json' // Intalian, florentine / Intnl.
import jp from './jp.json' // Japanese, International
import zh from './zh.json' // Chinese, not specified
import zhCn from './zh-cn.json' // Chinese, simplified

// this class is so built to handle grammatical exceptions,
// where a language's syntax doesn't fit into this prescribed form,
// and so must return something different.
//
// As cases arise, different exports should be created to handle edges
export default function locales (keys) {
	const w = (translatedWarning) => {
		console.warn(`🌐 ${translatedWarning} '${keys}'`)
	}

	// Falls back to english (or another form of the language if available)
	// for any desired translation chunk
	switch (config.locale) {
		case 'es': return es[keys] || (w('No hay traducción disponible por'), en[keys]);
		case 'fr': return fr[keys] || (w('Pas de traduction disponible pur'), en[keys]);
		case 'de': return de[keys] || (w('Keine Übersetzung verfügbar für'), en[keys]);
		case 'jp': return jp[keys] || (w('で利用可能な翻訳はありません'), en[keys]);
		case 'it': return it[keys] || (w('Nessuna traduzione disponibile per'), en[keys]);
		case 'zh-Hans': return zhCn[keys] || zh[keys] || (w('没有可用的翻译'), en[keys]);
		default: return en[keys];
	}
}
