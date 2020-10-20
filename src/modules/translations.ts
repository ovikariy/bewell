import { ErrorMessage } from "./Constants";

/* import matching Date and Time locales here for moment JS. Could import them where moment JS is used
e.g. helpers.ts but wanted to keep them next to the translations for consistency */
import 'moment/locale/ru';
import 'moment/locale/fr';

export type TranslationMap = { [language: string]: TranslationKeys };

export function getTranslationMessage(translation: TranslationKeys, messageId: string): string {
    const message = (translation as any)[messageId];
    return message ?? messageId;
}

export interface TranslationKeys {
    appName: string;
    note: string;
    mood: string;
    sleep: string;
    image: string;
    images: string;
    notes: string;
    moods: string;
    sleeps: string;
    happy: string;
    soso: string;
    couldBeBetter: string;
    restful: string;
    interrupted: string;
    poor: string;
    ok: string;
    cancel: string;
    done: string;
    save: string;
    dateAndTime: string;
    pickTime: string;
    loading: string;
    today: string;
    yesterday: string;
    at: string;
    more: string;
    less: string;
    areYouSureDeleteThisItem: string;
    deleteThisItem: string;
    selectItemFirst: string;
    itemDeleted: string;
    updatedSuccessfully: string;
    emptyList: string;
    password: string;
    passwordEnter: string;
    passwordEnterFile: string;
    passwordPleaseEnter: string;
    passwordPleaseReEnter: string;
    passwordChange: string;
    passwordChoose: string;
    passwordMinimum: string;
    passwordConfirm: string;
    passwordFile: string;
    passwordChanged: string;
    passwordConfirmPlaceholder: string;
    passwordEnterNewPlaceholder: string;
    passwordReEnterPlaceholder: string;
    passwordsMatch: string;
    passwordFieldsRequired: string;
    passwordInvalid: string;
    pinConfirm: string;
    pinEnter: string;
    pinReEnterPlaceholder: string;
    pinLock: string;
    pinLockYourApp: string;
    pinInstructions: string;
    pinReEnter: string;
    pinUseDigits: string;
    pinMatch: string;
    pinHasSet: string;
    pinTip: string;
    pinInvalid: string;
    secureData: string;
    secureDataWith: string;
    welcome: string;
    welcomeFriend: string;
    welcomeFriend2: string;
    welcomeBack: string;
    howAreYou: string;
    tapAddButtons: string;
    track: string;
    quickSetup: string;
    skip: string;
    doneGoHome: string;
    signIn: string;
    signOut: string;
    signOutClick: string;
    signOutWillClear: string;
    goBackNo: string;
    import: string;
    importExplanation: string;
    importExplanationLong: string;
    importBrowseExplanation: string;
    importComplete: string;
    importPress: string;
    importSelectedFile: string;
    importBrowse: string;
    importClear: string;
    fileEmpty: string;
    fileNoValidRecords: string;
    fileInvalidData: string;
    fileInvalidFormat: string;
    fileInvalidItemName: string;
    fileInvalidCopy: string;
    importExport: string;
    export: string;
    exportExplanation: string;
    exportSubExplanation: string;
    exportComplete: string;
    exportNoData: string;
    history: string;
    bedTime: string;
    wakeTime: string;
    whatsOnYourMind: string;
    yourWellbeing: string;
    home: string;
    settings: string;
    system: string;
    systemSubtitle: string;
    language: string;
    english: string;
    russian: string;
    theme: string;
    dark: string;
    light: string;
    version: string;
    pickImage: string;
    change: string;
    clear: string;
    cameroRollPermissions: string;

    [ErrorMessage.General]: string;
    [ErrorMessage.InvalidData]: string;
    [ErrorMessage.EmptyData]: string;
    [ErrorMessage.InvalidFormat]: string;
    [ErrorMessage.InvalidFile]: string;
    [ErrorMessage.InvalidFileData]: string;
    [ErrorMessage.NoRecordsInFile]: string;
    [ErrorMessage.InvalidParameter]: string;
    [ErrorMessage.InvalidKey]: string;
    [ErrorMessage.NewPasswordCannotBeBlank]: string;
    [ErrorMessage.InvalidPassword]: string;
    [ErrorMessage.InvalidPIN]: string;
    [ErrorMessage.InvalidCredentials]: string;
    [ErrorMessage.MissingPassword]: string;
    [ErrorMessage.InvalidFilePassword]: string;
    [ErrorMessage.UnableToSave]: string;
    [ErrorMessage.UnableToEncrypt]: string;
    [ErrorMessage.UnableToDecrypt]: string;
    [ErrorMessage.ImportError]: string;
    [ErrorMessage.ExportError]: string;
    [ErrorMessage.AccessStorage]: string;
    [ErrorMessage.PasswordAlreadySet]: string;
    [ErrorMessage.CannotSetPIN]: string;
    [ErrorMessage.Unauthorized]: string;
    [ErrorMessage.PasswordSet]: string;
    [ErrorMessage.PinSet]: string;
    [ErrorMessage.CannotDeleteFile]: string;
    [ErrorMessage.ImageNotFound]: string;
    [ErrorMessage.MaxLoginAttempts]: string;
}

export const translations: TranslationMap = {
    en: {
        appName: 'Wellbeing Tracker',
        note: 'Note',
        mood: 'Mood',
        sleep: 'Sleep',
        image: 'Image',
        images: 'Images',
        notes: 'Notes',
        moods: 'Moods',
        sleeps: 'Sleep',
        happy: 'Happy',
        soso: 'So-so',
        couldBeBetter: 'Could be better',
        restful: 'Restful',
        interrupted: 'Interrupted',
        poor: 'Poor',
        ok: 'Ok',
        cancel: 'Cancel',
        done: 'Done',
        save: 'Save',
        dateAndTime: 'date and time',
        pickTime: 'pick time',
        loading: 'Loading...',
        today: 'Today',
        yesterday: 'Yesterday',
        at: ' at ',
        more: 'more',
        less: 'less',
        areYouSureDeleteThisItem: 'Are you sure you wish to delete this item?',
        deleteThisItem: 'Delete this item?',
        selectItemFirst: 'Select item first',
        itemDeleted: 'Item deleted',
        updatedSuccessfully: 'Updated successfully',
        emptyList: 'Oops...looks like we don\'t have any items here',
        password: 'Password',
        passwordEnter: 'Enter password',
        passwordEnterFile: 'Enter File Password',
        passwordPleaseEnter: 'Please enter the password',
        passwordPleaseReEnter: 'Please re-enter the password',
        passwordChange: 'Change Password',
        passwordChoose: 'Consider choosing a passphrase with multiple separate random words for stronger protection',
        passwordMinimum: 'Please use the minimum of 8 characters and can be multiple words with spaces',
        passwordConfirm: 'Please confirm your password',
        passwordFile: 'Oops....cannot import the file. Maybe it was created with a different password? If so, please enter it below or try another file.',
        passwordChanged: 'Your password has been changed',
        passwordConfirmPlaceholder: 'Confirm current password',
        passwordEnterNewPlaceholder: 'Enter new password',
        passwordReEnterPlaceholder: 'Re-enter new password',
        passwordsMatch: 'Password and re-entered password must match',
        passwordFieldsRequired: 'All fields are required. New password must be at least 8 characters long',
        passwordInvalid: 'Invalid password',
        pinConfirm: 'Please confirm your PIN number',
        pinEnter: 'Enter PIN',
        pinReEnterPlaceholder: 'Re-enter PIN',
        pinLock: 'PIN Lock',
        pinLockYourApp: 'Lock your app with a PIN',
        pinInstructions: 'Enter at least a 4 digit PIN number below',
        pinReEnter: 'Re-enter your new PIN number',
        pinUseDigits: 'Please use at least 4 or 6 digits',
        pinMatch: 'PIN and re-entered PIN numbers must match',
        pinHasSet: 'Your PIN has been set',
        pinTip: 'Tip: use six or more digits \r\nfor stronger security',
        pinInvalid: 'Invalid PIN',
        secureData: 'Secure data',
        secureDataWith: 'Secure your data \r\nwith a password or \r\npass phrase',
        welcome: 'Welcome',
        welcomeFriend: 'Welcome friend!',
        welcomeFriend2: 'Welcome \r\nfriend!',
        welcomeBack: 'Welcome back, friend',
        howAreYou: 'How are you?',
        tapAddButtons: 'Tap the buttons above to add to your wellbeing',
        track: 'Track your wellbeing \r\nand keep your data private',
        quickSetup: 'Quick Setup',
        skip: 'Skip',
        doneGoHome: 'Done, go to Home screen',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        signOutClick: 'Click below \r\nto sign out',
        signOutWillClear: 'This will clear your session and prompt for login again',
        goBackNo: 'No, go back',
        import: 'Import',
        importExplanation: 'Import your app data from a file',
        importExplanationLong: 'Import data from file, maybe after moving to another device or after resetting the device',
        importBrowseExplanation: 'Browse for the file where you have stored it during a prior backup/export operation',
        importComplete: 'Data imported successfully',
        importPress: 'Press the button below to import the selected file',
        importSelectedFile: 'Selected File:',
        importBrowse: 'Browse for file',
        importClear: 'Clear File',
        fileEmpty: 'Looks like the file is empty',
        fileNoValidRecords: 'No valid records were found in the file',
        fileInvalidData: 'Invalid data, please try another file',
        fileInvalidFormat: 'Invalid format',
        fileInvalidItemName: 'Invalid type name found',
        fileInvalidCopy: 'Invalid file to copy',
        importExport: 'Import and Export',
        export: 'Export',
        exportExplanation: 'Export data to file to be used as a backup or for moving data to another device',
        exportSubExplanation: 'Your encrypted data is ready for export',
        exportComplete: 'Data export completed',
        exportNoData: 'Something went wrong. No data to export.',
        history: 'History',
        bedTime: 'Bed time:  ',
        wakeTime: 'Wake time: ',
        whatsOnYourMind: 'What\'s on your mind?',
        yourWellbeing: 'Your Wellbeing',
        home: 'Home',
        settings: 'Settings',
        system: 'System',
        systemSubtitle: 'Language, Theme, Version',
        language: 'Language',
        english: 'English',
        russian: 'Русский',
        theme: 'Theme',
        dark: 'Dark',
        light: 'Light',
        version: 'App Version',
        pickImage: 'Pick Image',
        change: 'Change',
        clear: 'Clear',
        cameroRollPermissions: 'Sorry, we need camera roll permissions to make this work!',

        [ErrorMessage.General]: 'An error has occurred',
        [ErrorMessage.InvalidData]: 'Invalid data',
        [ErrorMessage.EmptyData]: 'Looks like no records have been found',
        [ErrorMessage.InvalidFormat]: 'Invalid format',
        [ErrorMessage.InvalidFile]: 'Invalid file',
        [ErrorMessage.InvalidFileData]: 'Invalid data, please try another file',
        [ErrorMessage.NoRecordsInFile]: 'Looks like there are no records in file',
        [ErrorMessage.InvalidParameter]: 'Invalid parameter',
        [ErrorMessage.InvalidKey]: 'Invalid key',
        [ErrorMessage.NewPasswordCannotBeBlank]: 'New password cannot be blank',
        [ErrorMessage.InvalidPassword]: 'Invalid password, please try again',
        [ErrorMessage.InvalidPIN]: 'Invalid PIN, please try again',
        [ErrorMessage.InvalidCredentials]: 'Invalid credentials, please try again',
        [ErrorMessage.MissingPassword]: 'Missing password or PIN, please try again',
        [ErrorMessage.InvalidFilePassword]: 'Invalid password for this file, please try again',
        [ErrorMessage.UnableToSave]: 'Unable to save',
        [ErrorMessage.UnableToEncrypt]: 'Unable to encrypt',
        [ErrorMessage.UnableToDecrypt]: 'Unable to decrypt',
        [ErrorMessage.ImportError]: 'Import error',
        [ErrorMessage.ExportError]: 'Export error',
        [ErrorMessage.AccessStorage]: ' Unable to access storage',
        [ErrorMessage.PasswordAlreadySet]: 'Password has already been set, try logging in instead',
        [ErrorMessage.CannotSetPIN]: 'Cannot setup new PIN',
        [ErrorMessage.Unauthorized]: 'Unauthorized',
        [ErrorMessage.PasswordSet]: 'Password applied successfully',
        [ErrorMessage.PinSet]: 'PIN set successfully',
        [ErrorMessage.CannotDeleteFile]: 'Unable to delete file',
        [ErrorMessage.ImageNotFound]: 'Ooops, image file not found',
        [ErrorMessage.MaxLoginAttempts]: 'Lets try entering a password instead'
    },
    ru: {
        appName: 'Трекер Благосостояния',
        note: 'Запись',
        mood: 'Настроение',
        sleep: 'Сон',
        image: 'Фото',
        images: 'Фото',
        notes: 'Записи',
        moods: 'Настроения',
        sleeps: 'Сны',
        happy: 'Класс',
        soso: 'Так себе',
        couldBeBetter: 'Не очень',
        restful: 'Сладкий',
        interrupted: 'Не спокойный',
        poor: 'Не очень',
        ok: 'OK',
        cancel: 'Oтменить',
        done: 'Готово',
        save: 'Сохранить',
        dateAndTime: 'дата и время',
        pickTime: 'время',
        loading: 'Загрузка...',
        today: 'сегодня',       /* in Russian days of week are not capitalized */
        yesterday: 'вчера',     /* in Russian days of week are not capitalized */
        at: ' в ',
        more: 'Ещё',
        less: 'Меньше',
        areYouSureDeleteThisItem: 'Вы уверены, что хотите удалить этот элемент?',
        deleteThisItem: 'Удалить этот элемент?',
        selectItemFirst: 'Сначала выберите элемент',
        itemDeleted: 'Элемент удален',
        updatedSuccessfully: 'Успешно обновлено',
        emptyList: 'Упс...похоже, у нас здесь нет ничего',
        password: 'Пароль',
        passwordEnter: 'Введите пароль',
        passwordEnterFile: 'Введите пароль файла',
        passwordPleaseEnter: 'Пожалуйста, введите пароль',
        passwordPleaseReEnter: 'Пожалуйста, повторно введите пароль',
        passwordChange: 'Изменить пароль',
        passwordChoose: 'Рассмотрите возможность выбора ключевой фразы с несколькими отдельными несвязанными словами для более надежной защиты',
        passwordMinimum: 'Пожалуйста, используйте не менее 8 символов и может состоять из нескольких слов с пробелами',
        passwordConfirm: 'Пожалуйста, подтвердите ваш пароль',
        passwordFile: 'Упс...ошибка при импорте файла. Может быть, он был создан с другим паролем? Если это так, пожалуйста, введите его ниже или попробуйте другой файл.',
        passwordChanged: 'Ваш пароль был изменен',
        passwordConfirmPlaceholder: 'Подтвердите теперешний пароль',
        passwordEnterNewPlaceholder: 'Введите новый пароль',
        passwordReEnterPlaceholder: 'Повторите новый пароль',
        passwordsMatch: 'Пароль и повторно введенный пароль должны совпадать',
        passwordFieldsRequired: 'Все поля обязательны для заполнения. Новый пароль должен быть длиной не менее 8 символов',
        passwordInvalid: 'Неверный пароль',
        pinConfirm: 'Пожалуйста, подтвердите свой PIN-код',
        pinEnter: 'Введите PIN-код',
        pinReEnterPlaceholder: 'Повторите PIN-код',
        pinLock: 'PIN-код',
        pinLockYourApp: 'Защитите ваше проложение с помощью PIN-кода',
        pinInstructions: 'Введите как минимум 4-значный PIN-код ниже',
        pinReEnter: 'Повторно введите новый PIN-код',
        pinUseDigits: 'Пожалуйста, используйте как минимум 4-значный номер',
        pinMatch: 'PIN-код и повторно введенный PIN-код должны совпадать',
        pinHasSet: 'Ваш PIN-код был установлен',
        pinTip: 'Совет: используйте шесть или более цифр для более надежной защиты',
        pinInvalid: 'Неверный PIN-код',
        secureData: 'Защита данных',
        secureDataWith: 'Защитите свои данные \r\nпаролем или парольной фразой',
        welcome: 'Добро пожаловать',
        welcomeFriend: 'Добро пожаловать, друг!',
        welcomeFriend2: 'Добро пожаловать!',
        welcomeBack: 'С возвращением, друг',
        howAreYou: 'Как вы?',
        tapAddButtons: 'Жмите кнопки выше, чтобы описать ваше благосостояние',
        track: 'Отслеживайте свое благосостояние и сохраняйте конфиденциальность своих данных',
        quickSetup: 'Быстрая Настройка',
        skip: 'Пропустить',
        doneGoHome: 'Готово, перейти на главную',
        signIn: 'Войти',
        signOut: 'Выйти',
        signOutClick: 'Нажмите ниже \r\nчтобы выйти',
        signOutWillClear: 'Это выведет из приложения и снова запросит вход',
        goBackNo: 'Нет, вернуться',
        import: 'Импорт',
        importExplanation: 'Импорт вашых данных приложения из файла',
        importExplanationLong: 'Импортировать данные из файла, например, после перемещения на другое устройство или после сброса устройства',
        importBrowseExplanation: 'Найдите файл, который вы сохранили во время предыдущего резервного копирования / экспорта',
        importComplete: 'Данные успешно импортированы',
        importPress: 'Нажмите кнопку ниже, чтобы импортировать выбранный файл',
        importSelectedFile: 'Выбранный файл:',
        importBrowse: 'Поиск Файла',
        importClear: 'Отменить выбор файла',
        fileEmpty: 'Похоже, файл пуст',
        fileNoValidRecords: 'В файле не найдено действительных записей',
        fileInvalidData: 'Неверные данные, попробуйте другой файл',
        fileInvalidFormat: 'Неверный формат',
        fileInvalidItemName: 'Обнаружено неверное имя типа',
        fileInvalidCopy: 'Неверный файл для копирования',
        importExport: 'Импорт и Экспорт',
        export: 'Экспорт',
        exportExplanation: 'Экспорт данных в файл для использования в качестве резервной копии или для перемещения данных на другое устройство',
        exportSubExplanation: 'Ваши зашифрованные данные готовы к экспорту',
        exportComplete: 'Экспорт данных завершен',
        exportNoData: 'Что-то не так. Нет данных для экспорта.',
        history: 'История',
        bedTime: 'Заснул:  ',
        wakeTime: 'Проснулся: ',
        whatsOnYourMind: 'Что у вас на уме?',
        yourWellbeing: 'Благосостояние',
        home: 'Главная',
        settings: 'Настройки',
        system: 'Система',
        systemSubtitle: 'Язык, Тема устройства, Версия',
        language: 'Язык',
        english: 'English',
        russian: 'Русский',
        theme: 'Тема устройства',
        dark: 'Темная',
        light: 'Светлая',
        version: 'Версия Приложения',
        pickImage: 'Выберите Изображение',
        change: 'Поменять',
        clear: 'Убрать',
        cameroRollPermissions: 'Извините, нам нужен доступ к фотогалерее для добавления фотографий',

        [ErrorMessage.General]: 'Произошла ошибка',
        [ErrorMessage.InvalidData]: 'Неверные данные',
        [ErrorMessage.EmptyData]: 'Похоже, записи не найдены',
        [ErrorMessage.InvalidFormat]: 'Неверный формат',
        [ErrorMessage.InvalidFile]: 'Неверный файл',
        [ErrorMessage.InvalidFileData]: 'Неверные данные, попробуйте другой файл',
        [ErrorMessage.NoRecordsInFile]: 'Похоже, в файле нет записей',
        [ErrorMessage.InvalidParameter]: 'Неверный параметр',
        [ErrorMessage.InvalidKey]: 'Неверный ключ',
        [ErrorMessage.NewPasswordCannotBeBlank]: 'Новый пароль не может быть пустым',
        [ErrorMessage.InvalidPassword]: 'Неверный пароль, попробуйте ещё раз',
        [ErrorMessage.InvalidPIN]: 'Неверный PIN-код, попробуйте ещё раз',
        [ErrorMessage.InvalidCredentials]: 'Неверные учетные данные, попробуйте ещё раз',
        [ErrorMessage.MissingPassword]: 'Отсутствует пароль или PIN-код, попробуйте ещё раз',
        [ErrorMessage.InvalidFilePassword]: 'Неверный пароль для этого файла, попробуйте ещё раз',
        [ErrorMessage.UnableToSave]: 'Ошибка при сохранении',
        [ErrorMessage.UnableToEncrypt]: 'Ошибка при зашифровке',
        [ErrorMessage.UnableToDecrypt]: 'Ошибка при расшифровке',
        [ErrorMessage.ImportError]: 'Ошибка при импорте данных',
        [ErrorMessage.ExportError]: 'Ошибка при экспорте данных',
        [ErrorMessage.AccessStorage]: 'Невозможно получить доступ к хранилищу',
        [ErrorMessage.PasswordAlreadySet]: 'Пароль уже был установлен, попробуйте войти в систему',
        [ErrorMessage.CannotSetPIN]: 'Невозможно установить новый PIN-код',
        [ErrorMessage.Unauthorized]: 'Неразрешенный доступ',
        [ErrorMessage.PasswordSet]: 'Пароль успешно установлен',
        [ErrorMessage.PinSet]: 'PIN-код успешно установлен',
        [ErrorMessage.CannotDeleteFile]: 'Невозможно удалить файл',
        [ErrorMessage.ImageNotFound]: 'Файл изображения не найден',
        [ErrorMessage.MaxLoginAttempts]: 'Попробуйте ввести пароль'
    }
};