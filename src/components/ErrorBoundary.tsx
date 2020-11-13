import React from 'react';
import { View, Text } from 'react-native';
import { consoleLogWithColor } from '../modules/utils';

export class GlobalErrorBoundary extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        try {
            const message = error + (errorInfo ? '\r\n' + JSON.stringify(errorInfo) : '');
            consoleLogWithColor(message);
        }
        catch(error) {
            //already tried to log it
        }
    }

    render() {
        if (this.state.hasError) {
            return <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 30 }}>Ooops something went wrong. Please close the app and try again.</Text>
            </View>;
        }

        return this.props.children;
    }
}