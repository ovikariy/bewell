import * as Updates from 'expo-updates';
import * as Network from 'expo-network';
import { consoleLogWithColor } from './utils';

/**
 * @description Here we control OTA JS updates of the App.
 * @see devnotes.md#building-and-publishing-the-app for details.
 */
export async function fetchOverTheAirUpdate() {
    if (__DEV__)
        return; /* cannot check for updates in development mode */
    try {
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected || networkState.type !== Network.NetworkStateType.WIFI)
            return;

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable)
            await Updates.fetchUpdateAsync();
    }
    catch (error) {
        consoleLogWithColor(error);
    }
}