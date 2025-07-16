import NodeCache from 'node-cache';

const bibleCache = new NodeCache({ stdTTL: 3600 });

export default { bibleCache }