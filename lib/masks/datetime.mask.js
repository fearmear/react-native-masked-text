import BaseMask from './_base.mask';
var moment = require('moment');

const DATETIME_MASK_SETTINGS = {
    format: 'DD/MM/YYYY HH:mm:ss',
    optimisticallyDisplayTheseChars: ['/', ':', '.', '-']
};

export default class DatetimeMask extends BaseMask {
    static getType() {
        return 'datetime';
    }

    getValue(value, settings) {
        let mergedSettings = this._getMergedSettings(settings);
		let mask = '';

		for(var i = 0; i < mergedSettings.format.length; i++) {
			mask += mergedSettings.format[i].replace( /[a-zA-Z]+/g, '9');
        }
        
        const masked = this.getVMasker().toPattern(value, mask);

        const isPartialValue = masked.length < mergedSettings.format.length;
        const nextFormatChar = mergedSettings.format[masked.length];

        if (isPartialValue &&
            mergedSettings.optimisticallyDisplayTheseChars.includes(nextFormatChar)) {
            return masked + nextFormatChar;
        }

		return masked;
    }

    getRawValue(maskedValue, settings) {
        let mergedSettings = this._getMergedSettings(settings);
        return moment(maskedValue, mergedSettings.format, true);
    }

    validate(value, settings) {
        var maskedValue = this.getValue(value, settings);
        let mergedSettings = this._getMergedSettings(settings);
        var isValid = moment(maskedValue, mergedSettings.format, true).isValid();
        return isValid;
    }

    _getMergedSettings(settings) {
        return super.mergeSettings(DATETIME_MASK_SETTINGS, settings);
    }
}