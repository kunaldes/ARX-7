import assert from "assert";
import {Client} from "../helpers.js";
import {Twitter} from "../../src/commands/twitter";

let client = new Client();
let twitter = new Twitter(client);

let link = 'https://twitter.com/IanMitchel1/status/636939838512500736';

describe('Twitter', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should activate anywhere in phrase', () => {
      return twitter.message('Mocha', '#test', `Tweet ${link}!`).then(() => {
        assert(client.lastMessage);
      });
    });

    it('should log and handle malformed links', () => {
      return assert.throws(
        twitter.message('Mocha', '#test', `${link}AEIOU`).then(() => {
          assert.equal('Sorry, could not find Twitter info.', client.lastMessage);
        }), Error);
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [Twitter]', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Twitter]: '));
      });
    });
  });

  describe('Tweet Lookup', () => {
    it('should include username and Twitter handle', () => {
      return twitter.message('Mocha', '#test', link).then(() => {
        let tweet = client.lastMessage.toLowerCase();
        let expected = ' | By Ian Mitchell (@IanMitchel1)'.toLowerCase();
        assert(tweet.includes(expected));
      });
    });

    // it('should handle special characters', () => {
    //   return twitter.message('Mocha', '#test', link).then(() => {
    //     let tweet = client.lastMessage.toLowerCase();
    //     assert((tweet.includes('<') && tweet.includes('>')));
    //   });
    // });
  });
});
