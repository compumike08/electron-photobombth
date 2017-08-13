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

exports.choose = (seriously, src, target, effectName = EffectTypesConstants.VANILLA) => {
    effects[effectName](seriously, src, target);
};
