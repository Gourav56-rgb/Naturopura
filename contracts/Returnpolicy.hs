{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeApplications #-}

module ReturnPolicyContract where

import           Plutus.Contract as Contract
import           Ledger.Validation
import           Data.Map (Map)
import           Control.Monad

data ReturnPolicyDatum = ReturnPolicyDatum
   { policyOwner :: pubKeyHash
   , refundAmount :: Integer
   , returnWindows :: Integer
   } deriving (Generic)

data ReturnReason = WorangItem | DamagedItem | OtherReason

data ReturnAction = Refund | Exchange | Cancelled

initiateReturnEndpoint :: Contract (Last ReturnPolicyDatum) ReturnPolicy Text ()
initiateReturnEndpoint = endpoint @"initiateReturn" $ \txOutRef -> do
    
    if isTxOutRefValid txOutRef then
       
        if currentTimestamp > returnDeadline (datum state) then
            error "Return window expired"
        else
           
            pure []
    else
        error "Invalid txOutRef"



finalizeReturnEndpoint :: Contract (Last ReturnPolicyDatum) ReturnPolicy Text ()
finalizeReturnEndpoint = endpoint @"finalizeReturn" $ \txOutRef -> do
    
    if isTxOutRefValid txOutRef then
        
        if currentTimestamp > returnDeadline (datum state) then
            error "Return window expired"
        else
            
            pure []
    else
        error "Invalid txOutRef"

        