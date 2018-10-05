import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Thread } from '../thread/thread.model';
import { Message } from '../message/message.model';
import { ThreadsService } from './../thread/threads.service';
import { MessagesService } from './../message/messages.service';

@Component({
  selector: 'chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {
  threads: Observable<any>;
  unreadThread: any;

  constructor(public threadsService: ThreadsService, public messagesService: MessagesService) {
    this.threads = threadsService.orderedThreads;
  }

  ngOnInit() {
    this.messagesService.messages
      .combineLatest(
        this.threadsService.currentThread,
        (messages: Message[], currentThread: Thread) =>
          [currentThread, messages] )

      .subscribe(([currentThread, messages]: [Thread, Message[]]) => {
        this.unreadThread = {};
        _.reduce(
          messages,
          (sum: number, m: Message) => {
            const messageIsInCurrentThread: boolean = m.thread &&
              currentThread &&
              (currentThread.id === m.thread.id);
                if (m && !m.isRead && !messageIsInCurrentThread) {
                  sum = sum + 1;
                  let cid = m.thread.id;
                  if (this.unreadThread[cid]) {
                    this.unreadThread[cid].sum = this.unreadThread[cid].sum + 1;
                  } else {
                    this.unreadThread[cid] = { sum : 1 };
                  }
                }
                return sum;
          },
        0);
      });
  }
}
