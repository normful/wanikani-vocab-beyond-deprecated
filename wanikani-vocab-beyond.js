// ==UserScript==
// @name        WaniKani Vocab Beyond
// @namespace   normful
// @description Shows WWWJDIC vocab with Forvo audio for each kanji in lessons, reviews, and kanji pages. A paid Forvo API key is required for audio.
// @version     0.0.31
// @include     https://www.wanikani.com/*
// @copyright   2018+, Norman Sue
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @connect     nihongo.monash.edu
// @connect     apifree.forvo.com
// ==/UserScript==

// TODO: add @updateURL and @downloadURL

var DISABLE_ALL_LOGGING = false;

var DISABLE_FORVO = false;

// Partially-modified, originally taken from: http://nihongo.monash.edu/dictionarycodes.html
var WWWJDIC_DICTIONARY_CODES = {
  abbr: 'abbreviation',
  'adj-f': 'noun or verb acting prenominally',
  'adj-i': 'I-adjective',
  'adj-kari': "'kari' adjective (archaic)",
  'adj-ku': "'ku' adjective (archaic)",
  'adj-na': 'na-adjective',
  'adj-nari': 'archaic/formal form of na-adjective',
  'adj-no': 'No-adjective',
  'adj-pn': 'pre-noun adjectival (rentaishi)',
  'adj-s': 'special adjective',
  'adj-shiku': "'shiku' adjective (archaic)",
  'adj-t': "'taru' adjective",
  adv: 'adverb',
  'adv-n': 'adverbial noun',
  'adv-to': 'adverb taking the と particle',
  an: 'adjectival noun (keiyoudoushi)',
  anat: 'anatomical term',
  arch: 'archaism',
  archit: 'architecture term',
  astron: 'astronomy, etc. term',
  ateji: 'ateji reading',
  aux: 'auxiliary',
  'aux-adj': 'auxiliary adjective',
  'aux-v': 'auxiliary verb',
  baseb: 'baseball term',
  biol: 'biology term',
  bot: 'botany term',
  Buddh: 'Buddhist term',
  bus: 'business term',
  c: 'company name',
  chem: 'chemistry term',
  chn: "children's language",
  col: 'colloquialism',
  comp: 'computer terminology',
  conj: 'conjunction',
  ctr: 'counter',
  derog: 'derogatory word or expression',
  econ: 'economics term',
  eK: 'exclusively written in kanji',
  engr: 'engineering term',
  exp: 'expression',
  f: 'female given name',
  fam: 'familiar language',
  fem: 'female term or language',
  finc: 'finance term',
  food: 'food term',
  g: 'given name, as-yet not classified by sex',
  geol: 'geology, etc. term',
  geom: 'geometry term',
  gikun: 'gikun (meaning) reading',
  gram: 'grammatical term',
  h: 'full (family plus given) name of a person',
  hob: 'Hokkaido-ben',
  hon: 'honorific (sonkeigo) language',
  hum: 'humble (kenjougo) language',
  id: 'idiomatic expression',
  ik: 'word containing irregular kana usage',
  iK: 'word containing irregular kanji usage',
  int: 'interjection',
  io: 'irregular okurigana usage',
  iv: 'irregular verb',
  joc: 'jocular, humorous term',
  ksb: 'Kansai-ben',
  ktb: 'Kantou-ben',
  kyb: 'Kyoto-ben',
  kyu: 'Kyuushuu-ben',
  law: 'law, etc. term',
  ling: 'linguistics terminology',
  m: 'male given name',
  'm-sl': 'manga slang',
  MA: 'martial arts term',
  male: 'male term or language',
  'male-sl': 'male slang',
  math: 'mathematics',
  med: 'medicine, etc. term',
  mil: 'military',
  music: 'music term',
  n: 'noun',
  'n-adv': 'adverbial noun',
  'n-pr': 'proper noun',
  'n-pref': 'prefix noun',
  'n-suf': 'suffix noun',
  'n-t': 'temporal noun',
  nab: 'Nagano-ben',
  neg: 'negative (in a negative sentence, or with negative verb)',
  'neg-v': 'negative verb (when used with)',
  num: 'numeral',
  o: 'organization name',
  obs: 'obsolete term',
  obsc: 'obscure term',
  ok: 'out-dated or obsolete kana usage',
  oK: 'word containing out-dated kanji',
  'on-mim': 'onomatopoeic or mimetic word',
  osb: 'Osaka-ben',
  p: 'place-name',
  physics: 'physics terminology',
  pn: 'pronoun',
  poet: 'poetical term',
  pol: 'polite language',
  pr: 'product name',
  pref: 'prefix',
  proverb: 'proverb',
  prt: 'particle',
  qv: 'quod vide (see another entry)',
  rare: 'rare',
  rkb: 'Ryukyuan language',
  s: 'surname',
  sens: 'sensitive',
  Shinto: 'Shinto term',
  sl: 'slang',
  sports: 'sports term',
  st: 'station name',
  suf: 'suffix',
  sumo: 'sumo term',
  thb: 'Touhoku-ben',
  tsb: 'Tosa-ben',
  tsug: 'Tsugaru-ben',
  u: 'unclassified name',
  uk: 'usually written using kana alone',
  uK: 'usually written using kanji alone',
  'v-unspec': 'verb unspecified',
  v1: 'Ichidan verb',
  'v2a-s': 'Nidan verb (archaic)',
  'v2b-k': 'Nidan verb (archaic)',
  'v2b-s': 'Nidan verb (archaic)',
  'v2d-k': 'Nidan verb (archaic)',
  'v2d-s': 'Nidan verb (archaic)',
  'v2g-k': 'Nidan verb (archaic)',
  'v2g-s': 'Nidan verb (archaic)',
  'v2h-k': 'Nidan verb (archaic)',
  'v2h-s': 'Nidan verb (archaic)',
  'v2k-k': 'Nidan verb (archaic)',
  'v2k-s': 'Nidan verb (archaic)',
  'v2m-k': 'Nidan verb (archaic)',
  'v2m-s': 'Nidan verb (archaic)',
  'v2n-s': 'Nidan verb (archaic)',
  'v2r-k': 'Nidan verb (archaic)',
  'v2r-s': 'Nidan verb (archaic)',
  'v2s-s': 'Nidan verb (archaic)',
  'v2t-k': 'Nidan verb (archaic)',
  'v2t-s': 'Nidan verb (archaic)',
  'v2w-s': 'Nidan verb (archaic)',
  'v2y-k': 'Nidan verb (archaic)',
  'v2y-s': 'Nidan verb (archaic)',
  'v2z-s': 'Nidan verb (archaic)',
  v4b: 'Yodan verb (archaic)',
  v4g: 'Yodan verb (archaic)',
  v4h: 'Yondan verb (archaic)',
  v4k: 'Yodan verb (archaic)',
  v4m: 'Yodan verb (archaic)',
  v4n: 'Yodan verb (archaic)',
  v4r: 'Yondan verb (archaic)',
  v4s: 'Yodan verb (archaic)',
  v4t: 'Yodan verb (archaic)',
  v5aru: 'Godan verb',
  v5b: 'Godan verb',
  v5g: 'Godan verb',
  v5k: 'Godan verb',
  'v5k-s': 'Godan verb',
  v5m: 'Godan verb',
  v5n: 'Godan verb',
  v5r: 'Godan verb',
  'v5r-i': 'Godan verb',
  v5s: 'Godan verb',
  v5t: 'Godan verb',
  v5u: 'Godan verb',
  'v5u-s': 'Godan verb',
  v5uru: 'Godan verb',
  v5z: 'Godan verb',
  vi: 'intransitive verb',
  vk: 'kuru verb',
  vn: 'irregular nu verb',
  vr: 'irregular ru verb, plain form ends with -ri',
  vs: 'Suru verb',
  'vs-c': 'su verb - precursor to the modern suru',
  'vs-i': 'suru verb - irregular',
  'vs-s': 'suru verb - special class',
  vt: 'transitive verb',
  vulg: 'vulgar expression or word',
  vz: 'Ichidan verb - -zuru special class (alternative form of -jiru verbs)',
  X: 'rude or X-rated term',
  zool: 'zoology term',
};

var logPrefix = '[WKVB] ';
var windowProp = '__wanikani_vocab_beyond_section_object';

// HTML IDs
var sectionHeaderID = 'wkvb_section_header';
var sectionID = 'wkvb_section';
var legendLinkID = 'wkvb_legend_link';

// WKOF constants
var settingsLinkName = 'wkvb_forvo_api_key_settings';
var settings_script_id = 'wanikani_vocab_beyond_settings';

var forvoUserWhitelist = [''];
var EMPTY_FORVO_USER_WHITELIST = JSON.stringify(forvoUserWhitelist);

var Log = {
  prefix: logPrefix,
  debug: function(string) {
    if (DISABLE_ALL_LOGGING) {
      return;
    }
    console.debug(Log.prefix + string);
  },
  info: function(string) {
    if (DISABLE_ALL_LOGGING) {
      return;
    }
    console.log(Log.prefix + string);
  },
  warn: function(string) {
    if (DISABLE_ALL_LOGGING) {
      return;
    }
    console.warn(Log.prefix + string);
  },
  error: function(string) {
    if (DISABLE_ALL_LOGGING) {
      return;
    }
    console.error(Log.prefix + string);
  },
};

var $ = unsafeWindow.$;
var PageEnum = Object.freeze({ unknown: 0, kanji: 1, reviews: 2, lessons: 3 });
var curPage = PageEnum.unknown;

function init() {
  waitUntilWkofIsLoaded(function(wkof) {
    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings').then(function() {
      wkof.Menu.insert_script_link({
        name: settingsLinkName,
        submenu: 'Vocab Beyond',
        title: 'Settings',
        on_click: onSettingsMenuLinkClick.bind(null, wkof),
      });

      wkof.Settings.load(settings_script_id).then(function(settings) {
        doInsertIntoPage(settings);
      });
    });
  });
}

function waitUntilWkofIsLoaded(callback) {
  var maxWaitMs = 5000;
  var intervalMs = 10;
  var startMs = new Date().getTime();

  var intervalID = setInterval(function checkExistence() {
    if (unsafeWindow.wkof) {
      clearInterval(intervalID);
      callback(unsafeWindow.wkof);
      return;
    }

    if (new Date().getTime() - startMs > maxWaitMs) {
      clearInterval(intervalID);
      promptWkofInstall();
    }
  }, intervalMs);
}

function promptWkofInstall() {
  if (unsafeWindow.__wkvb_promptedWkofInstall) {
    return;
  }

  unsafeWindow.__wkvb_promptedWkofInstall = true;
  if (
    confirm(
      'WaniKani Vocab Beyond requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?'
    )
  ) {
    window.location.href =
      'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
  }
}

function onSettingsMenuLinkClick(wkof) {
  var config = {
    script_id: settings_script_id,
    title: 'WaniKani Vocab Beyond',
    autosave: true,
    background: false,
    on_save: onSettingsSave.bind(null, wkof),
    content: {
      forvo_page_id: {
        type: 'page',
        label: 'Audio',
        hover_tip: 'Settings for Forvo.com audio pronunciations',
        content: {
          forvo_instructions: {
            type: 'html',
            html:
              "<p><a href='https://forvo.com' target='_blank'>Forvo.com</a> has an audio collection of words pronounced by native Japanese speakers.</p>" +
              '<p>To enable Forvo pronunciations of vocabulary words:</p>' +
              "<p>1. <a href='https://forvo.com/signup/' target='_blank'>Sign up for a Forvo.com account</a></p>" +
              "<p>2. <a href='https://api.forvo.com/plans-and-pricing' target='_blank'>Purchase an API key here</a></p>" +
              '<p>3. Enter your key below</p>',
          },

          forvo_api_key: {
            type: 'text',
            label: 'Forvo API key',
            full_width: true,
            hover_tip: 'Your API key from https://api.forvo.com/',
          },

          forvo_caveat: {
            type: 'html',
            html:
              "<p>(WaniKani Vocab Beyond will work without a Forvo API key, but you won't be able to see audio controls for vocabulary.)</p>",
          },

          forvo_divider_id: {
            type: 'divider',
          },

          forvo_rating_instructions: {
            type: 'html',
            html:
              '<p>Forvo pronunciations are voted on by users. Change this to limit the displayed audio to those with at least this overall number of (upvotes - downvotes). Zero is the default and recommended value.</p>',
          },

          forvo_min_rating: {
            type: 'number',
            label: 'Minimum Forvo rating',
            hover_tip:
              'Only show Forvo pronunciations with at least this rating',
            placeholder: 0,
            default: 0,
            full_width: false,
          },

          forvo_divider_id_2: {
            type: 'divider',
          },

          forvo_whitelist_instructions: {
            type: 'html',
            html:
              '<p>Comma-separated list of Forvo users whose pronunciations should be shown. If blank, pronunciations from all users are shown.</p>',
          },

          forvo_username_whitelist_csv: {
            type: 'text',
            label: 'Favorite Forvo users',
            full_width: true,
            placeholder:
              'skent,usako_usagiclub,strawberrybrown,poyotan,kaoring',
            default: '',
            hover_tip:
              'A comma-separated list of Forvo usernames whose pronunciations should be shown',
          },
        },
      },

      vocab_page_id: {
        type: 'page',
        label: 'Vocab',
        hover_tip: 'Settings for WWWJDIC vocabulary words',
        content: {
          vocab_instructions_1: {
            type: 'html',
            html:
              "<p>By default, only common words are retrieved and displayed from <a href='http://nihongo.monash.edu/cgi-bin/wwwjdic' target='_blank'>WWWJDIC</a>. You can also retrieve uncommon words and phrases by checking the box below. (Warning: this may quickly exhaust your Forvo API key's daily request limits).</p>",
          },

          show_all_wwwjdic_vocab: {
            type: 'checkbox',
            label: 'Show uncommon vocab',
            hover_tip: 'Show both common and uncommon WWWJDIC vocab',
            default: false,
            full_width: false,
          },
        },
      },

      appearance_page_id: {
        type: 'page',
        label: 'Appearance',
        hover_tip: 'Appearance settings',
        content: {
          appearance_instructions_1: {
            type: 'html',
            html:
              '<p>Check the box below to display the Vocab Beyond section at the top of the page, instead of the bottom.</p>',
          },

          show_vocab_beyond_at_top: {
            type: 'checkbox',
            label: 'Show Vocab Beyond at top',
            hover_tip:
              'Show the Vocab Beyond section at the top of lessons, reviews, and kanji pages',
            default: false,
            full_width: false,
          },

          appearance_instructions_2: {
            type: 'html',
            html:
              '<p>Check the box below to reduce the legend to only a link to the full WWWJDIC abbreviations list.</p>',
          },

          only_show_link_in_legend: {
            type: 'checkbox',
            label: 'Only show link in legend',
            hover_tip:
              'Only show a link to the WWWJDIC abbreviations page in the legend.',
            default: false,
            full_width: false,
          },

          appearance_instructions_3: {
            type: 'html',
            html:
              '<p>Check the box below to show Forvo usernames above audio clips.</p>',
          },

          show_forvo_usernames: {
            type: 'checkbox',
            label: 'Show Forvo usernames',
            hover_tip: 'Show Forvo usernames above each audio clip',
            default: false,
            full_width: false,
          },
        },
      },
    },
  };

  var dialog = new wkof.Settings(config);
  dialog.open();
}

function onSettingsSave(wkof) {
  var updatedSettings = wkof.settings[settings_script_id];
  loadVocab(updatedSettings);
}

function doInsertIntoPage(settings) {
  determinePageType();

  if (curPage === PageEnum.unknown) {
    return;
  }

  unsafeWindow[windowProp] = createEmptyVocabSection(settings);

  var o;
  switch (curPage) {
    case PageEnum.kanji:
      if (!settings.show_vocab_beyond_at_top) {
        addPageListHeaderLink();
      }
      loadVocab(settings);
      break;
    case PageEnum.reviews:
      o = new MutationObserver(function(mutations) {
        if (mutations.length != 2) return;

        if (getKanji() !== null) {
          setTimeout(function() {
            var vs = createEmptyVocabSection(settings);
            if (vs !== null && vs.length > 0) {
              unsafeWindow[windowProp] = vs;
              loadVocab(settings);
            }
          }, 150);
        }
      });
      o.observe(document.getElementById('item-info'), { attributes: true });
      break;
    case PageEnum.lessons:
      // TODO: Ensure this stuff all works for lessons
      o = new MutationObserver(loadVocab.bind(null, settings));
      o.observe(document.getElementById('supplement-kan'), {
        attributes: true,
      });
      loadVocab(settings);
      break;
  }
}

function determinePageType() {
  if (/\/kanji\/./.test(document.URL)) {
    curPage = PageEnum.kanji;
  } else if (/\/review\/session/.test(document.URL)) {
    curPage = PageEnum.reviews;
  } else if (/\/lesson\/session/.test(document.URL)) {
    curPage = PageEnum.lessons;
  }
}

function addPageListHeaderLink() {
  var header = $('.page-list-header');
  var listItem = $('<li>');
  var link = $("<a href='#" + sectionHeaderID + "''>Vocab Beyond</a>");
  listItem.append(link);

  // Other scripts may have altered this list, so just insert this link at the end
  listItem.insertAfter(header.siblings().last());
}

function getKanji() {
  switch (curPage) {
    case PageEnum.kanji:
      return document.title[document.title.length - 1];

    case PageEnum.reviews:
      var curItem = $.jStorage.get('currentItem');

      if ('kan' in curItem) {
        return curItem.kan.trim();
      } else {
        return null;
      }

    case PageEnum.lessons:
      var kanjiNode = $('#character');

      if (kanjiNode === undefined || kanjiNode === null) {
        return null;
      }

      return kanjiNode.text().trim();
  }

  return null;
}

// Creates a section for the vocab and returns a pointer to the jQuery object.
function createEmptyVocabSection(settings) {
  if ($('#' + sectionID).length == 0) {
    var sectionHTML =
      '<section>' +
      '<h2 id="' +
      sectionHeaderID +
      '">Vocab Beyond</h2>' +
      '<div id="' +
      sectionID +
      '"></div>' +
      '</section>';

    switch (curPage) {
      case PageEnum.kanji:
        var informationSection = $('#information');

        if (settings.show_vocab_beyond_at_top) {
          $(sectionHTML).insertAfter(informationSection);
        } else {
          var lastSection = informationSection.siblings().last();
          $(sectionHTML).insertAfter(lastSection);
        }
        break;
      case PageEnum.reviews:
        if (settings.show_vocab_beyond_at_top) {
          $('#item-info-col2').prepend(sectionHTML);
        } else {
          $('#item-info-col2').append(sectionHTML);
        }
        break;
      case PageEnum.lessons:
        if (settings.show_vocab_beyond_at_top) {
          $('#supplement-kan-breakdown .col1').append(sectionHTML);
        } else {
          // TODO: Figure out a better location to insert
          $('#supplement-kan-breakdown .col1').append(sectionHTML);
        }
        break;
    }

    var headerEl = $('#' + sectionHeaderID);
    createLegend(headerEl, settings);
  }

  return $('#' + sectionID);
}

function createLegend(headerEl, settings) {
  var legend = $('<p>');
  legend.text('Legend');
  legend.css('color', '#888888');

  headerEl.after(legend);

  var moreLink = $(
    '<a href="http://nihongo.monash.edu/dictionarycodes.html" id="' +
      legendLinkID +
      '" target="_blank">(more)</a>'
  );
  moreLink.css('margin-left', '5px');
  moreLink.css('color', '#888888');
  moreLink.css('margin-left', '5px');
  moreLink.css('text-decoration', 'none');

  legend.append(moreLink);

  if (settings.only_show_link_in_legend) {
    return;
  }

  // Creates legend entries for commonly seen WWWJDIC dictionary codes
  [
    'ik (IRREGULAR KANA USAGE)',
    'iK (IRREGULAR KANJI USAGE)',
    'ok (OUTDATED KANA USAGE)',
    'oK (OUTDATED KANJI)',
  ].forEach(function(legendEntryText) {
    var legendEntry = $('<p>');
    legendEntry.text(legendEntryText);
    legendEntry.css('color', '#888888');
    legendEntry.css('font-size', '11px');
    legendEntry.css('font-weight', 'normal');
    legendEntry.css('line-height', '1.3em');
    legendEntry.css('letter-spacing', '0');
    legendEntry.css('margin-top', '0');
    legendEntry.css('margin-bottom', '0.5em');
    legendEntry.css('border-bottom', '0');

    legend.after(legendEntry);
  });
}

// Queries the WWWJDIC server for the vocab and displays it the section
function loadVocab(settings) {
  if (!unsafeWindow) {
    return;
  }

  var section = unsafeWindow[windowProp];
  if (!section.length) {
    return;
  }

  var showMessage = function(message) {
    section.html(message);
  };

  showMessage('Loading...');

  var kanji = getKanji();
  if (!kanji) {
    Log.error('could not get kanji');
    return;
  }

  var wwwJdicUrl = makeWwwjdicUrl(kanji, settings);

  GM_xmlhttpRequest({
    method: 'GET',
    url: wwwJdicUrl,
    onload: function(xhr) {
      if (xhr.status !== 200) {
        Log.error('WWWJDIC non-200 XHR', xhr);
        showMessage('Error contacting WWWJDIC server');
        return;
      }

      onWwwJdicResponse(xhr.responseText, section, showMessage, settings);
    },
    onerror: function(err) {
      Log.error('WWWJDIC onerror XHR', err);
      showMessage('Error contacting WWWJDIC server');
    },
  });
}

// API Docs: http://www.edrdg.org/wwwjdic/wwwjdicinf.html#backdoor_tag
function makeWwwjdicUrl(kanji, settings) {
  var encodedKanji = encodeURIComponent(kanji);

  var useEDICT = '1';

  var useBackdoorEntryRawOutput = 'Z';

  var searchType;
  var dictionaryLookupWithUTF8LookupText = 'U';
  searchType = dictionaryLookupWithUTF8LookupText;

  var keyType;
  var lookupCommonAndUncommonWords = 'J';
  var lookupCommonWords = 'P';
  if (settings.show_all_wwwjdic_vocab) {
    keyType = lookupCommonAndUncommonWords;
  } else {
    keyType = lookupCommonWords;
  }

  var queryCode = useEDICT + useBackdoorEntryRawOutput + searchType + keyType;

  return (
    'http://nihongo.monash.edu/cgi-bin/wwwjdic?' + queryCode + encodedKanji
  );
}

function onWwwJdicResponse(res, section, showMessage, settings) {
  if (res.indexOf('No matches were found for this key') > -1) {
    showMessage('No vocab available.');
    return;
  }

  var noHeader = res.slice(res.indexOf('<pre>') + 6);
  var preBody = noHeader.slice(0, noHeader.indexOf('</pre>') - 1);
  var lines = preBody.split(/\r?\n/);

  Log.debug('WWWJDIC entries received. lines.length=' + lines.length);

  // Clear loading text
  section.text('');

  populateForvoUserWhitelist(settings);

  lines.forEach(function(line, i) {
    var trimmedLine = line.trim();

    // Split up Japanese and English text components
    var firstForwardSlashIndex = line.indexOf('/');
    var jpText = line.substring(0, firstForwardSlashIndex);
    var enText = line.substring(firstForwardSlashIndex + 1);

    // Clean up Japanese text
    var commonWordRegex = /\(P\)/g;
    jpText = jpText.replace(commonWordRegex, '');

    // Clean up English text by replacing forward slashes with semi-colons
    var forwardSlashRegex = /\//g;
    enText = enText.replace(forwardSlashRegex, '; ');

    // Split part of speech from definition
    var firstRightParen = enText.indexOf(')');
    var enPOSText = enText.substring(1, firstRightParen);
    enPOSText = convertPartOfSpeechShortformIntoLongform(enPOSText);
    var enDefn = enText.substring(firstRightParen + 2);

    // Since we are searching only for common words, there will
    // always be a '; (P);' at the end of the string at this point,
    // since all common words are labeled with a (P) in WWWJDIC
    enDefn = enDefn.substring(0, enDefn.indexOf('; (P);'));

    var definitions = [];

    if (enDefn.indexOf('(1) ') === 0) {
      var nextDefNum = 2;
      var cur = 0; // index of start of current definition text
      var next = 0; // index of start of next definition text

      while (true) {
        next = enDefn.indexOf('(' + nextDefNum + ')', cur);
        if (next > -1) {
          definitions.push(tidyNumberedDefinition(enDefn.substring(cur, next)));
          nextDefNum++;
          cur = next;
        } else {
          definitions.push(tidyNumberedDefinition(enDefn.substring(cur)));
          break;
        }
      }
    } else {
      definitions.push(enDefn);
    }

    var listItem = $('<div>');
    listItem.css('margin-bottom', '35px');

    var jpEl = $('<h3>');
    jpEl.text(jpText);
    jpEl.css('font-size', '45px');
    jpEl.css('font-weight', 'normal');
    jpEl.css('line-height', '45px');
    jpEl.css('margin-top', '20px');
    jpEl.css('margin-right', '0');
    jpEl.css('margin-bottom', '15px');
    jpEl.css('margin-left', '0');
    jpEl.css('padding', '0');
    listItem.append(jpEl);

    var enPOSEl = $('<h3>');
    enPOSEl.text(enPOSText);
    enPOSEl.css('font-size', '20px');
    enPOSEl.css('font-weight', 'normal');
    enPOSEl.css('line-height', '20px');
    enPOSEl.css('padding', '0');
    listItem.append(enPOSEl);

    definitions.forEach(function(definition) {
      var enDefnEl = $('<p>');
      enDefnEl.text(definition);
      enDefnEl.css('margin-bottom', '0');
      enDefnEl.css('padding', '0');
      listItem.append(enDefnEl);
    });

    section.append(listItem);

    if (!DISABLE_FORVO) {
      var jpVocabText = extractJpVocabText(jpText);
      addForvoAudioForThisWord(jpVocabText, listItem, settings);
    }
  });

  if (!DISABLE_FORVO) {
    var forvoAttribution = $(
      '<p><a href="https://forvo.com/" target="_blank">Pronunciations by Forvo</a></p>'
    );
    section.append(forvoAttribution);
  }
}

function convertPartOfSpeechShortformIntoLongform(commaDelimitedPos) {
  if (!commaDelimitedPos) {
    return '';
  }
  return (commaDelimitedPos.split(',') || [])
    .map(function(part) {
      var longForm = WWWJDIC_DICTIONARY_CODES[part];
      return longForm ? capitalize(longForm) : capitalize(part);
    })
    .join(', ');
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function tidyNumberedDefinition(string) {
  var re = /\((\d+)\)(.*)/;
  var matches = string.match(re);
  if (!matches) {
    return string;
  }
  var dotDefn = matches[1] + '.' + matches[2];
  return dotDefn.replace(/;\s*$/, '');
}

// Extracts out only the first Japanese vocabulary word from the
// WWWJDIC Japanese text that also includes the hiragana in brackets
function extractJpVocabText(jpText) {
  // 3000-303F: punctuation
  // 3040-309F: hiragana
  // 30A0-30FF: katakana
  // FF00-FFEF: Full-width roman + half-width katakana
  // 4E00-9FAF: Common and uncommon kanji

  var jpRegex = /([\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF])+/;

  var matches = jpText.match(jpRegex);

  if (!matches) {
    return;
  }

  return matches[0];
}

function populateForvoUserWhitelist(settings) {
  forvoUserWhitelist = settings.forvo_username_whitelist_csv
    .trim()
    .replace(/ /g, '')
    .split(',');
}

function callForvoApiAsync(jpVocabText, settings) {
  if (!settings.forvo_api_key) {
    return;
  }

  var forvoApiKey = settings.forvo_api_key;

  var forvoUrl =
    'https://apifree.forvo.com/key/' +
    forvoApiKey +
    '/format/json' +
    '/action/word-pronunciations' +
    '/word/' +
    encodeURIComponent(jpVocabText) +
    '/language/ja' +
    '/rate/' +
    String(settings.forvo_min_rating) +
    '/country/JPN' +
    '/order/rate-desc';

  return new Promise(function(resolve, reject) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: forvoUrl,
      onload: function onForvoLoad(xhr) {
        if (xhr.status !== 200) {
          return reject(xhr);
        }
        return resolve(xhr);
      },
      onerror: function(e) {
        return reject(e);
      },
    });
  });
}

function handleForvoSuccess(res, listItem, settings) {
  if (!listItem) {
    Log.error('listItem missing');
    return;
  }

  var parsedForvoJson;
  try {
    parsedForvoJson = JSON.parse(res);
  } catch (parseErr) {
    Log.error('JSON parseErr', parseErr);
  }

  var forvoItems = parsedForvoJson.items;
  if (!forvoItems || forvoItems.length == 0) {
    return;
  }

  var audioSection = $('<div>');
  audioSection.css('margin-top', '10px');

  forvoItems.forEach(function(forvoItem) {
    if (!forvoItem.pathmp3) {
      Log.error('!forvoItem.pathmp3');
      return;
    }

    if (!forvoItem.username) {
      Log.error('!forvoItem.username');
      return;
    }

    if (
      JSON.stringify(forvoUserWhitelist) !== EMPTY_FORVO_USER_WHITELIST &&
      !forvoUserWhitelist.includes(forvoItem.username)
    ) {
      Log.info('skipping pronunciation from ' + forvoItem.username);
      return;
    }

    var audioContainer = $('<div>');
    audioContainer.css('fontSize', '12px');
    audioContainer.css('display', 'inline-block');
    audioContainer.css('box-sizing', 'border-box');
    audioContainer.css('width', '250px');
    audioContainer.css('margin-top', '0');
    audioContainer.css('margin-right', '5px');
    audioContainer.css('margin-bottom', '5px');
    audioContainer.css('margin-left', '0');
    audioContainer.css('padding', '0');

    var audioEl = document.createElement('audio');
    audioEl.src = forvoItem.pathmp3;
    audioEl.controls = 'controls';
    audioEl.preload = 'none';
    audioEl.type = 'audio/mpeg';
    audioEl.style.width = '250px';

    if (settings.show_forvo_usernames) {
      var usernameEl = $('<span>');
      usernameEl.text(forvoItem.username);
      usernameEl.css('fontSize', '14px');
      usernameEl.css('color', '#cccccc');
      usernameEl.css('margin', '0');
      usernameEl.css('padding', '0');
      audioContainer.prepend(usernameEl);
    }

    audioContainer.append(audioEl);
    audioSection.append(audioContainer);
  });

  listItem.append(audioSection);
}

function addForvoAudioForThisWord(jpVocabText, listItem, settings) {
  callForvoApiAsync(jpVocabText, settings)
    .then(function(xhr) {
      var res = xhr.responseText;
      if (!res) {
        return Promise.reject('responseText missing');
      }
      handleForvoSuccess(res, listItem, settings);
    })
    .catch(function(e) {
      Log.error('Forvo API error', e);
    });
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
