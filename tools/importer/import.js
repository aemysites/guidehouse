/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import accordion2Parser from './parsers/accordion2.js';
import columns1Parser from './parsers/columns1.js';
import columns5Parser from './parsers/columns5.js';
import cards3Parser from './parsers/cards3.js';
import columns4Parser from './parsers/columns4.js';
import hero6Parser from './parsers/hero6.js';
import cards7Parser from './parsers/cards7.js';
import columns8Parser from './parsers/columns8.js';
import columns9Parser from './parsers/columns9.js';
import cardsNoImages12Parser from './parsers/cardsNoImages12.js';
import cards11Parser from './parsers/cards11.js';
import columns14Parser from './parsers/columns14.js';
import tabs10Parser from './parsers/tabs10.js';
import cards15Parser from './parsers/cards15.js';
import hero16Parser from './parsers/hero16.js';
import hero19Parser from './parsers/hero19.js';
import columns17Parser from './parsers/columns17.js';
import cardsNoImages18Parser from './parsers/cardsNoImages18.js';
import columns24Parser from './parsers/columns24.js';
import columns20Parser from './parsers/columns20.js';
import columns21Parser from './parsers/columns21.js';
import hero25Parser from './parsers/hero25.js';
import columns27Parser from './parsers/columns27.js';
import columns28Parser from './parsers/columns28.js';
import columns29Parser from './parsers/columns29.js';
import columns32Parser from './parsers/columns32.js';
import columns33Parser from './parsers/columns33.js';
import columns31Parser from './parsers/columns31.js';
import columns34Parser from './parsers/columns34.js';
import hero30Parser from './parsers/hero30.js';
import columns35Parser from './parsers/columns35.js';
import columns37Parser from './parsers/columns37.js';
import columns36Parser from './parsers/columns36.js';
import hero40Parser from './parsers/hero40.js';
import columns39Parser from './parsers/columns39.js';
import columns41Parser from './parsers/columns41.js';
import carousel38Parser from './parsers/carousel38.js';
import columns42Parser from './parsers/columns42.js';
import columns43Parser from './parsers/columns43.js';
import cards45Parser from './parsers/cards45.js';
import accordion44Parser from './parsers/accordion44.js';
import columns47Parser from './parsers/columns47.js';
import columns49Parser from './parsers/columns49.js';
import columns48Parser from './parsers/columns48.js';
import columns50Parser from './parsers/columns50.js';
import columns51Parser from './parsers/columns51.js';
import columns53Parser from './parsers/columns53.js';
import cards46Parser from './parsers/cards46.js';
import cards52Parser from './parsers/cards52.js';
import columns54Parser from './parsers/columns54.js';
import columns55Parser from './parsers/columns55.js';
import columns57Parser from './parsers/columns57.js';
import columns58Parser from './parsers/columns58.js';
import tabs56Parser from './parsers/tabs56.js';
import hero59Parser from './parsers/hero59.js';
import cardsNoImages60Parser from './parsers/cardsNoImages60.js';
import accordion62Parser from './parsers/accordion62.js';
import columns63Parser from './parsers/columns63.js';
import cards61Parser from './parsers/cards61.js';
import hero64Parser from './parsers/hero64.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  accordion2: accordion2Parser,
  columns1: columns1Parser,
  columns5: columns5Parser,
  cards3: cards3Parser,
  columns4: columns4Parser,
  hero6: hero6Parser,
  cards7: cards7Parser,
  columns8: columns8Parser,
  columns9: columns9Parser,
  cardsNoImages12: cardsNoImages12Parser,
  cards11: cards11Parser,
  columns14: columns14Parser,
  tabs10: tabs10Parser,
  cards15: cards15Parser,
  hero16: hero16Parser,
  hero19: hero19Parser,
  columns17: columns17Parser,
  cardsNoImages18: cardsNoImages18Parser,
  columns24: columns24Parser,
  columns20: columns20Parser,
  columns21: columns21Parser,
  hero25: hero25Parser,
  columns27: columns27Parser,
  columns28: columns28Parser,
  columns29: columns29Parser,
  columns32: columns32Parser,
  columns33: columns33Parser,
  columns31: columns31Parser,
  columns34: columns34Parser,
  hero30: hero30Parser,
  columns35: columns35Parser,
  columns37: columns37Parser,
  columns36: columns36Parser,
  hero40: hero40Parser,
  columns39: columns39Parser,
  columns41: columns41Parser,
  carousel38: carousel38Parser,
  columns42: columns42Parser,
  columns43: columns43Parser,
  cards45: cards45Parser,
  accordion44: accordion44Parser,
  columns47: columns47Parser,
  columns49: columns49Parser,
  columns48: columns48Parser,
  columns50: columns50Parser,
  columns51: columns51Parser,
  columns53: columns53Parser,
  cards46: cards46Parser,
  cards52: cards52Parser,
  columns54: columns54Parser,
  columns55: columns55Parser,
  columns57: columns57Parser,
  columns58: columns58Parser,
  tabs56: tabs56Parser,
  hero59: hero59Parser,
  cardsNoImages60: cardsNoImages60Parser,
  accordion62: accordion62Parser,
  columns63: columns63Parser,
  cards61: cards61Parser,
  hero64: hero64Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  replaceWithErrorBlock: (element, message) => {
    if (!element || !element.parentElement) return;
    const headerRow = ['Columns (exc-import-error)'];
    const rows = [headerRow, [message]];

    const errorElement = WebImporter.DOMUtils.createTable(rows, document);
    try {
      element.replaceWith(errorElement);
    } catch (e) {
      console.warn(`Failed to replace element with error element: ${message}`, e);
    }
  },
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

const ReportBuilder = () => {
  const report = { 'Has Failed Parser': 'false', 'Failed Parsers': [] };
  return {
    getReport: () => report,
    addFailedParser: (parserName) => {
      report['Has Failed Parser'] = 'true';
      report['Failed Parsers'].push(parserName);
    },
  };
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL }, reportBuilder } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, document.body, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const emptyElement = document.createElement('div');
      const { element = emptyElement, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];

      let parserElement = element;
      if (typeof parserElement === 'string') {
        parserElement = document.body.querySelector(parserElement);
      }
      const originalContent = parserElement.innerHTML;
      try {
        main.append(parserElement);
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        if (parserFn) {
          // parse the element
          parserFn.call(this, parserElement, { ...source });
          if (parserElement.parentElement && parserElement.innerHTML === originalContent) {
            WebImporter.Import.replaceWithErrorBlock(parserElement, `Failed to parse content into block - please check the parser ${parserName}`);
            reportBuilder.addFailedParser(parserName);
          }
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
        WebImporter.Import.reaplceWithErrorBlock(parserElement, `Failed to parse content into block with exception: "${e.message}" - please check the parser ${parserName}`);
        if (parserFn) {
          reportBuilder.addFailedParser(parserName);
        }
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, {
  fragment, inventory, publishUrl, ...source
}) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth, publishUrl,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    const reportBuilder = ReportBuilder();
    const sourceBody = document.body;
    const main = document.createElement('div');

    // before transform hook
    WebImporter.Import.transform(
      TransformHook.beforeTransform,
      sourceBody,
      { ...payload, inventory },
    );

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      transformFragment(main, {
        ...payload, fragment, inventory, publishUrl, reportBuilder,
      });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory, reportBuilder });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(
      TransformHook.afterTransform,
      main,
      { ...payload, inventory },
    );

    return [{
      element: main,
      path,
      report: reportBuilder.getReport(),
    }];
  },
};
