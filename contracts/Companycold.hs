{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TypeApplications #-}

import Plutus.Contract as Contract
import qualified Data.Map as Map
import Ledger
import Wallet.Emulator

data ColdStorageDatum = ColdStorageDatum
    { owner :: PubKeyHash
    , storedAssets :: Map.Map AssetClass Integer
    } deriving 

type ColdStorageSchema =
    BlockchainActions
        .\/ Endpoint "store" AssetClass
        .\/ Endpoint "retrieve" AssetClass

ColdStorageContract :: Contract ColdStorage Text()
ColdStorageContract = do
    -- Initialize the contract state (e.g., data storage) and define your logic
    let initialDatum = ColdStorageDatum (pubKeyHash pk) Map.empty


     -- Define the contract endpoints and their associated contract logic
    Contract.handleError
        (\err -> Contract.logError $ "Error: " ++ unpack err)
        $ Contract.selectList [activateEndpoint, deactivateEndpoint, storeEndpoint, retrieveEndpoint]


     where
        pk = walletPubKey $ Wallet 1

        activateEndpoint :: Contract (Last ColdStorageDatum) ColdStorageSchema Text ()
        activateEndpoint = endpoint @"activate" $ \() -> do

         logInfo @String "Cold storage activated."
        pure []


    deactivateEndpoint :: Contract (Last ColdStorageDatum) ColdStorageSchema Text ()
    deactivateEndpoint = endpoint @"deactivate" $ \() -> do

         logInfo @String "Cold storage deactivated."
        pure []


    storeEndpoint :: Contract (Last ColdStorageDatum) ColdStorageSchema Text ()
    storeEndpoint = endpoint @"store" $ \assetClass -> do

        logInfo @String "Cold storage"
        pure []

    retrieveEndpoint :: AssetClass -> Contract (Last ColdStorageDatum) ColdStorageSchema Text ()
    retrieveEndpoint assetClass = endpoint @"retrieve" $ \() -> do
       let datum = ColdStorageDatum (ownPubKeyHash tx) (Map.singleton assetClass 1)
       let tx = Constraints.mustSpendScriptOutput

  