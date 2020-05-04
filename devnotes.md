#region 1.1

ScrollView is used here because it handles keyboard dismiss properly, otherwise keyboard remains visible even after leaving the text input and pressing buttons on the screen if cannot use a ScrollView use another approach: https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native

contentContainerStyle={{ flexGrow: 1 }}  is used to stretch the content vertically

#endregion