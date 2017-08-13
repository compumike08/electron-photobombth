const {EffectTypesConstants} = require('./effectTypesConstants');

const effects = {
    vanilla: (seriously, src, target) => {
        target.source = src;
        seriously.go();
    },
    ascii: (seriously, src, target) => {
        const ascii = seriously.effect(EffectTypesConstants.ASCII);
        ascii.source = src;
        target.source = ascii;
        seriously.go();
    }
};

const effectNames = Object.keys(effects);
let currentIndex = 0;

function setNextIndex() {
    const nextIndex = currentIndex + 1 < effectNames.length ? currentIndex + 1 : 0;
    currentIndex = nextIndex;
    return currentIndex;
}

function setIndexToEffectIndex(effectName) {
    currentIndex = effectNames.indexOf(effectName);
    return currentIndex;
}

exports.choose = (seriously, src, target, effectName = EffectTypesConstants.VANILLA) => {
    effects[effectName](seriously, src, target);
    setIndexToEffectIndex(effectName);
};

exports.cycle = (seriously, src, target) => {
    setNextIndex();
    effects[effectNames[currentIndex]](seriously, src, target);
};
