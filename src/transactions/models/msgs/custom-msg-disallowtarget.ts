import { MsgDisallowTarget } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class CustomMsgDisallowTarget extends TxMsg {
    public readonly fromAddress: string
    public readonly token: string
    public readonly chainId: string
    public readonly KEY: string = "/x.bridgepool.MsgDisallowTarget"
    public readonly AMINO_KEY: string = "bridgepool/msg_disallow_target"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} chainId - network Id
     * @param {string} token - token
     */
    public constructor(fromAddress: string, chainId: string, token: string) {
        super()
        this.fromAddress = fromAddress
        this.chainId = chainId
        this.token = token
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {object} - Msg type key value.
     * @memberof MsgSend
     */
    public toStdSignDocMsgObj(): object {
        return { 
            type: this.AMINO_KEY, 
            value: { 
                chainId: this.chainId,
                fromAddress: this.fromAddress.toLowerCase(), 
                token: this.token.toLowerCase()
            } 
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof CustomMsgDisallowTarget
     */
    public toStdTxMsgObj(): any {
        const data = { 
            fromAddress: Buffer.from(this.fromAddress, "hex"),
            chainId: this.chainId,
            token: this.token.toLowerCase()
        }

        const result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgDisallowTarget.encode(data).finish()).toString("base64")
        });

        return result;
    }

    static decodeStdTxMsgValue(value: string): any {
        return MsgDisallowTarget.decode(Buffer.from(value, 'base64'))
    }
}