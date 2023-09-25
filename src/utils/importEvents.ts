import * as ready from '@src/events/ready';
import * as messageCreated from '@src/events/messageCreated';

export default function getAllEvents() {
  return [ready, messageCreated];
}
