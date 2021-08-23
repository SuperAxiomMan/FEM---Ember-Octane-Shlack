import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ChannelFooterComponent extends Component {
  @tracked
  body = '';

  get isDisabled() {
    return !this.body;
  }

  @action
  updateMessageBody(evt) {
    this.body = evt.target.value;
  }

  // @action
  // sendMessage() {
  //   this.args.sendChatMessage(this.body)
  // }

  @action
  async handleSubmit(evt) {
    evt.preventDefault();
    this.args.sendMessage(this.body);
    this.body = '';
  }
}
