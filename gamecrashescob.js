var crypto = require('crypto');


// Set this to the hash you wish to start from:
var hash = process.argv[2];
if (!hash) throw new Error('You need to call this script with the starting hash!');

var terminatingHash = 'f701c153685f5556afd6eb4ecaca0f00d2836b5e2885edbd885eba15409f019e'

while (hash != terminatingHash) {
	console.log(crashPointFromHash(hash));
	hash = genGameHash(hash);
}


function divisible(hash, mod) {
    // We will read in 4 hex at a time, but the first chunk might be a bit smaller
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;

    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }

    return val === 0;
}

function genGameHash(serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
};


function crashPointFromHash(serverSeed) {
    var hash = crypto.createHmac('sha256', serverSeed).update('000000000000000007a9a31ff7f07463d91af6b5454241d5faf282e5e0fe1b3a').digest('hex');

    // In 1 of 101 games the game crashes instantly.
    if (divisible(hash, 101))
        return 0;

    // Use the most significant 52-bit from the hash to calculate the crash point
    var h = parseInt(hash.slice(0,52/4),16);
    var e = Math.pow(2,52);

    return (Math.floor((100 * e - h) / (e - h))/100).toFixed(2);
};