{-# LANGUAGE DataKinds #-}
{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE TemplateHaskell #-}

import Plutus.Contract as Contract
import PlutusTx.Prelude hiding (Semigroup(..), unless)
import Ledger
import qualified Ledger.Typed.Scripts as Scripts
import qualified Ledger.Ada as Ada


data PartnershipDatum = Contribution Integer | JointResearch | Distribution
    deriving Show

data PartnershipEndpoint = ContributeFunds Integer | StartJointResearch | DistributeProfits

mkPartnershipContract :: () -> Contract () BlockchainActions PartnershipDatum ()
mkPartnershipContract () = mkStateMachine (Contribution 0) $ SMContract
    { smcInitialState      = Contribution 0
    , smcTransition        = partnershipTransition
    , smcCheck             = partnershipCheck
    , smcEndpoints         = partnershipEndpoints
    }

mkPartnershipContract :: () -> Contract () BlockchainActions PartnershipDatum ()
mkPartnershipContract () = do

     let validate :: PartnershipDatum -> ScriptContext -> Bool
        validate (Contribution amount) ctx =
            Ada.fromValue (valueLockedBy (scriptContextTxInfo ctx) (ownAddress ctx)) == amount
        validate JointResearch _ = True
        validate Distribution _ = True


      -- Transition from JointResearch to Distribution
    (JointResearch, _, DistributeProfits) ->
        Just ( Constraints.mustBeSignedBy (pubKeyHash $ contributor input)
             , Distribution
             )

    -- Any other transitions are not allowed
    _ -> Nothing


partnershipCheck :: PartnershipDatum -> State -> Input -> ScriptContext -> Bool
partnershipCheck _ _ _ = True


PartnershipEndpoint :: Contract () BlockchainActions PartnershipDatum ()
PartnershipEndpoint = do
    contributeFunds' <- endpoint @"contributeFunds"
    funds <- Contract.handleEndpoint contributeFunds'
    let contributeAction = funds >>= \amount -> Contract.submitTxConstraints (spendOwnPubKeyHash amount) (Constraints.mustPayToTheScript $ Contribution amount)
    void $ Contract.awaitTxConfirmed $ Contract.submitTxConstraintsSpending contributeAction


startJointResearch' <- endpoint @"startJointResearch"
void $ Contract.handleEndpoint startJointResearch'
void $ Contract.submitTxConstraints (Constraints.mustPayToTheScript JointResearch) (Constraints.mustBeSignedBy (pubKeyHash $ contributor defaultInput))

 distributeProfits' <- endpoint @"distributeProfits"
    void $ Contract.handleEndpoint distributeProfits'
    void $ Contract.submitTxConstraints (Constraints.mustPayToTheScript Distribution) (Constraints.mustBeSignedBy (pubKeyHash $ contributor defaultInput))

  where
        spendOwnPubKeyHash :: Integer -> TxConstraints () ()
        spendOwnPubKeyHash amount = Constraints.mustPayToPubKeyHash (pubKeyHash $ contributor defaultInput) $ Ada.toValue amount
        

data PartnershipInput = PartnershipInput
 {
    contributer :: pubKeyHash
 }

defaultInput :: PartnershipInput
defaultInput = PartnershipInput
    { 
        contributor = pubKeyHash $ walletPubKey $ Wallet 1
    }