import axios from 'axios'
import {CONFIG} from './config'

const {HEARTBEAT_URL} = CONFIG;

export class ConnectionStatus {
    static check() {
        return axios.get(HEARTBEAT_URL);
    }
}