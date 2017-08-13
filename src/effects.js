const {EffectTypesConstants} = require('./effectTypesConstants');

function connectEffect(seriously, src, target, effect) {
    effect.source = src;
    target.source = effect;
    seriously.go();
}

const effects = {
    vanilla: (seriously, src, target) => {
        target.source = src;
        seriously.go();
    },
    ascii: (seriously, src, target) => {
        const ascii = seriously.effect(EffectTypesConstants.ASCII);
        connectEffect(seriously, src, target, ascii);
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
