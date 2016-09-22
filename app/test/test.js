const should = require('should')

describe('Array', () => {
	describe('#indexOf()', () => {
		it('should return -1 when the value is not present', () => {
			should([1,2,3].indexOf(4)).be.exactly(-1)
		})
	})
})
