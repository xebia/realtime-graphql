import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Comment} from './comment';
import ApolloClient, {createNetworkInterface, NetworkInterface} from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';

export class CommentService {
  private networkInterface: NetworkInterface;
  private client: ApolloClient;

  private wsNetworkInterface: NetworkInterface;
  private wsClient: SubscriptionClient;

  private initialized = false;

  private _commentSubject: BehaviorSubject<Comment>;
  public comment: Observable<Comment>;
  
  constructor() {
    
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.networkInterface = createNetworkInterface("http://localhost:3000/graphql");
    
    this.wsClient = new SubscriptionClient('ws://localhost:5000/', {
      reconnect: true,
      connectionParams: {
            // Pass any arguments you want for initialization
      },
    });

    // Extend the network interface with the WebSocket
    this.wsNetworkInterface = addGraphQLSubscriptions(
        this.networkInterface,
        this.wsClient,
    );

    this.client = new ApolloClient({
      networkInterface: this.wsNetworkInterface
    });

    const initialComment = await this.getComment();
    if (initialComment === undefined) {
      throw new Error("Cannot get initial comment value");
    }

    this._commentSubject = new BehaviorSubject<Comment>(initialComment);
    this.comment = this._commentSubject.asObservable();
    
    this.client.subscribe({
      query: gql`
        subscription commentAdded{
          commentAdded{
            author
            comment
          }
        }`
      })
      .subscribe({
        next: (data:{commentAdded: Comment}) => {
          if (data === undefined || data.commentAdded === undefined) {
            console.warn("invalid data:", data);
            return;
          }
          
          this._commentSubject.next({
            author: data.commentAdded.author,
            comment: data.commentAdded.comment
          });
          
        },
        error(err) {console.log(err)}
      })
  }

  protected async getComment(): Promise<Comment|undefined> {
    const response: {data: {comment?: Comment}} = await this.client.query({
      query: gql`{ comment( query:"" ) {
        author
        comment
      } }`
    })
    
    if (!response || !response.data || !response.data.comment) {
      return undefined;
    }

    return {
      author: response.data.comment.author, 
      comment: response.data.comment.comment
    };
  }

}
