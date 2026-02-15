'use strict';

QUnit.module("Тестируем функцию emailAnalyzer", function() {
    QUnit.test("Работает правильно со строкой с одним email", function(assert) {
        const input = "Мой email: user@example.com.";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 1,
            uniqueEmails: ["user@example.com"],
            mostFrequentEmail: "user@example.com"
        });
    });

    QUnit.test("Работает правильно со строкой с разными регистрами email", function(assert) {
        const input = "Контакты: User@Example.com и user@example.com.";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 2,
            uniqueEmails: ["user@example.com"],
            mostFrequentEmail: "user@example.com"
        });
    });

    QUnit.test("Работает правильно со строкой с некорректными email", function(assert) {
        const input = "Некорректные email: user@, @example.com, user@domain..com.";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 0,
            uniqueEmails: [],
            mostFrequentEmail: ""
        });
    });
});
    QUnit.test("Работает с пустой строкой", function(assert) {
        const input = "";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 0,
            uniqueEmails: [],
            mostFrequentEmail: ""
        });
    });

    QUnit.test("Работает со строкой без email", function(assert) {
        const input = "Здесь нет электронных адресов, только обычный текст.";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 0,
            uniqueEmails: [],
            mostFrequentEmail: ""
        });
    });

    QUnit.test("Находит несколько разных email", function(assert) {
        const input = "Свяжитесь с нами: support@company.com или sales@company.com или info@company.com";
        const result = emailAnalyzer(input);

        assert.deepEqual(result, {
            emailCount: 3,
            uniqueEmails: ["support@company.com", "sales@company.com", "info@company.com"],
            mostFrequentEmail: "support@company.com" // или любой другой, т.к. все встречаются по 1 разу
        });
    });

    QUnit.test("Правильно определяет самый частый email", function(assert) {
        const input = "test@test.com test@test.com user@mail.ru admin@site.com test@test.com user@mail.ru";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 6, "Должно быть 6 email");
        assert.strictEqual(result.uniqueEmails.length, 3, "Должно быть 3 уникальных email");
        assert.strictEqual(result.mostFrequentEmail, "test@test.com", "Самый частый - test@test.com (встречается 3 раза)");
    });

    QUnit.test("Обрабатывает email со сложными доменами", function(assert) {
        const input = "test@mail.ru test@mail.co.uk user@sub.domain.com info@domain-with-dash.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 4, "Должно быть 4 email");
        assert.ok(result.uniqueEmails.includes("test@mail.ru"), "Должен содержать test@mail.ru");
        assert.ok(result.uniqueEmails.includes("test@mail.co.uk"), "Должен содержать test@mail.co.uk");
        assert.ok(result.uniqueEmails.includes("user@sub.domain.com"), "Должен содержать user@sub.domain.com");
        assert.ok(result.uniqueEmails.includes("info@domain-with-dash.com"), "Должен содержать info@domain-with-dash.com");
    });

    QUnit.test("Обрабатывает email со специальными символами в локальной части", function(assert) {
        const input = "user.name@example.com user-name@example.com user+name@example.com user_name@example.com user%name@example.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 5, "Должно быть 5 email");
        assert.strictEqual(result.uniqueEmails.length, 5, "Все email должны быть уникальными");
    });

    QUnit.test("Корректно обрабатывает email с цифрами в домене", function(assert) {
        const input = "test@123.com user@domain123.org info@sub.domain123.co.uk";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 3, "Должно быть 3 email");
        assert.ok(result.uniqueEmails.includes("test@123.com"), "Должен содержать test@123.com");
        assert.ok(result.uniqueEmails.includes("user@domain123.org"), "Должен содержать user@domain123.org");
        assert.ok(result.uniqueEmails.includes("info@sub.domain123.co.uk"), "Должен содержать info@sub.domain123.co.uk");
    });

    QUnit.test("Игнорирует email с некорректными символами", function(assert) {
        const input = "user@domain..com user@domain,com user@@domain.com user@.domain.com user@domain.c @domain.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 0, "Не должно быть найденных email");
        assert.deepEqual(result.uniqueEmails, [], "Массив уникальных email должен быть пуст");
        assert.strictEqual(result.mostFrequentEmail, "", "Самый частый email должен быть пустой строкой");
    });

    QUnit.test("Правильно работает с email, разделенными разными символами", function(assert) {
        const input = "email1@test.com,email2@test.com;email3@test.com email4@test.com\temail5@test.com\nemail6@test.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 6, "Должно быть 6 email");
        assert.strictEqual(result.uniqueEmails.length, 6, "Все email должны быть уникальными");
    });

    QUnit.test("Обрабатывает email с очень длинными доменами", function(assert) {
        const input = "user@very-very-very-very-very-long-domain-name.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 1, "Должен быть 1 email");
        assert.deepEqual(result.uniqueEmails, ["user@very-very-very-very-very-long-domain-name.com"], "Должен содержать длинный email");
        assert.strictEqual(result.mostFrequentEmail, "user@very-very-very-very-very-long-domain-name.com", "Самый частый email должен быть единственным");
    });

    QUnit.test("Правильно работает при одинаковой частоте нескольких email", function(assert) {
        const input = "a@test.com a@test.com b@test.com b@test.com c@test.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 5, "Должно быть 5 email");
        assert.strictEqual(result.uniqueEmails.length, 3, "Должно быть 3 уникальных email");
        
        // Проверяем, что mostFrequentEmail содержит один из email с максимальной частотой (2)
        const possibleFrequentEmails = ["a@test.com", "b@test.com"];
        assert.ok(possibleFrequentEmails.includes(result.mostFrequentEmail), 
            `Самый частый email должен быть a@test.com или b@test.com, получен ${result.mostFrequentEmail}`);
    });

    QUnit.test("Обрабатывает email с точками в начале или конце домена как некорректные", function(assert) {
        const input = "user@.domain.com user@domain.com. user@domain..com user@domain.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 2, "Должно быть только 2 корректных email");
        assert.deepEqual(result.uniqueEmails, ["user@domain.com"], "Только user@domain.com должен быть найден");
        assert.strictEqual(result.mostFrequentEmail, "user@domain.com", "Самый частый email должен быть user@domain.com");
    });

    QUnit.test("Обрабатывает email с цифрами в локальной части", function(assert) {
        const input = "user123@test.com 123user@test.com user123user@test.com";
        const result = emailAnalyzer(input);

        assert.strictEqual(result.emailCount, 3, "Должно быть 3 email");
        assert.strictEqual(result.uniqueEmails.length, 3, "Все email должны быть уникальными");
    });


