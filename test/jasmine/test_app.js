'use strict';

describe('App', function() {
    beforeEach(module('deiCodebreak'));

    it('exists', function () {

        expect(angular.module('deiCodebreak')).toBeDefined();
    });

    it('did not overwrite version used by the build step', inject(function (appVersion) {

        expect(appVersion).toBe('xxAppVersion');
    }));
});
