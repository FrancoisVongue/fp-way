import {WithDefault} from "./object";

describe('WithDefault', () => {
    it('should override default props in case user provides one', () => {
        const defObj = {
            name: 'vasil',
            surname: 'petrenko',
        };
        const provided = {
            name: 'taras',
            surname: 'shevchenko',
        }

        const result = WithDefault(defObj, provided);
        expect(result).toEqual({
            name: 'taras',
            surname: 'shevchenko',
        })
    })
    it('should override default props in case user provides one', () => {
        const defObj = {
            name: 'vasil',
            surname: 'petrenko',
        };
        const provided = {
            name: 'taras',
            surname: 'shevchenko',
        }

        const result = WithDefault(defObj, provided);
        expect(result).toEqual({
            name: 'taras',
            surname: 'shevchenko',
        })
    })
});
