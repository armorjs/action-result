import {ArmorActionResult} from '../src/action-result';
import {ArmorActionResultCode} from '../src/code';

describe('ArmorActionResult', () => {
	let instance: ArmorActionResult;

	beforeAll(() => {
		instance = new ArmorActionResult();
	});

	describe('Constructor', () => {
		it('should initialize state', () => {
			expect(instance.state).not.toBeUndefined();
		});

		it('should intialize code to NOT_SET', () => {
			expect(instance.code).toBe(ArmorActionResultCode.NOT_SET);
		});

		it('should initialize payload to null', () => {
			expect(instance.payload).toBeNull();
		});
	});

	describe('Implementation', () => {
		beforeEach(() => {
			instance.code = ArmorActionResultCode.NOT_SET;
		});

		describe('error', () => {
			it('should add error to queue when errors argument is a single error', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.state.errors).toEqual([]);
				const error = new Error('message here');
				customInstance.error(error);
				expect(customInstance.state.errors).toHaveLength(1);
			});

			it('should add single errors to queue when called multiple times with a single error', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.state.errors).toEqual([]);
				customInstance.error(new Error('message here 1'));
				customInstance.error(new Error('message here 2'));
				customInstance.error(new Error('message here 3'));

				expect(customInstance.state.errors).toHaveLength(3);
			});

			it('should add all errors in error array argument when there are no errors', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.state.errors).toEqual([]);
				customInstance.error([new Error('message'), new Error('more messages')]);

				expect(customInstance.state.errors).toHaveLength(2);
			});

			it('should add all errors in error array argument when called multiple times', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.state.errors).toEqual([]);
				customInstance.error([new Error('message 121'), new Error('more messages 441')]);
				customInstance.error([new Error('message 313'), new Error('more messages 551')]);
				expect(customInstance.state.errors).toHaveLength(4);
			});
		});

		describe('complete', () => {
			let hasFailedMock: any;
			beforeAll(() => {
				hasFailedMock = jest.spyOn(instance.state, 'hasFailed');
			});

			beforeEach(() => {
				hasFailedMock.mockReset();
			});

			afterAll(() => {
				hasFailedMock.mockRestore();
			});

			it('should result code to success when state reports the action succeeded', () => {
				hasFailedMock.mockImplementation(() => {
					return false;
				});

				instance.code = ArmorActionResultCode.NOT_SET;
				instance.complete();
				expect(instance.code).toBe(ArmorActionResultCode.SUCCESS);
			});

			it('should result code to failure when state reports the action failed', () => {
				hasFailedMock.mockImplementation(() => {
					return true;
				});

				instance.code = ArmorActionResultCode.SUCCESS;
				instance.complete();
				expect(instance.code).toBe(ArmorActionResultCode.FAILURE);
			});
		});

		describe('message', () => {
			it('should add string to messages', () => {
				const customInstance = new ArmorActionResult();
				const message = '10914091409 100914 14481';
				expect(customInstance.state.messages).toHaveLength(0);
				customInstance.message(message);
				expect(customInstance.state.messages).toHaveLength(1);
			});

			it('should add all strings in array to messages when messages is empty', () => {
				const customInstance = new ArmorActionResult();
				const messages = ['one', 'two', 'three'];
				expect(customInstance.state.messages).toHaveLength(0);
				customInstance.message(messages);
				expect(customInstance.state.messages).toHaveLength(messages.length);
			});

			it('should add all strings in array to messages when messages have already been queued', () => {
				const customInstance = new ArmorActionResult();
				const messages = ['one', 'two', 'three', 'four'];
				customInstance.message('one');
				customInstance.message('two');
				expect(customInstance.state.messages).toHaveLength(2);
				customInstance.message(messages);
				expect(customInstance.state.messages).toHaveLength(messages.length + 2);
			});

			it('should not add message when message argument is not a string', () => {
				const customInstance = new ArmorActionResult();
				const message = 4411 as any;
				expect(customInstance.state.messages).toHaveLength(0);
				customInstance.message(message);
				expect(customInstance.state.messages).toHaveLength(0);
			});

			it('should not add messages when messages array is non-strings', () => {
				const customInstance = new ArmorActionResult();
				const messages = [111 as any, 333 as any, 4441 as any];
				customInstance.message('one');
				expect(customInstance.state.messages).toHaveLength(1);
				customInstance.message(messages);
				expect(customInstance.state.messages).toHaveLength(1);
			});

			it('should add valid string messages when messages array contains valid and invalid data', () => {
				const customInstance = new ArmorActionResult();
				const messages = [111 as any, 333 as any, 'two', 'five'];
				customInstance.message('one');
				expect(customInstance.state.messages).toHaveLength(1);
				customInstance.message(messages);
				expect(customInstance.state.messages).toHaveLength(3);
			});
		});

		describe('fail', () => {
			it('should set code to SUCCESS', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.code).toBe(ArmorActionResultCode.NOT_SET);
				customInstance.fail();
				expect(customInstance.code).toBe(ArmorActionResultCode.FAILURE);
			});
		});

		describe('success', () => {
			it('should set code to SUCCESS', () => {
				const customInstance = new ArmorActionResult();
				expect(customInstance.code).toBe(ArmorActionResultCode.NOT_SET);
				customInstance.succeed();
				expect(customInstance.code).toBe(ArmorActionResultCode.SUCCESS);
			});
		});
	});
});