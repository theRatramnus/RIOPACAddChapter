

function replaceDashesWithEnDash(input: string): string {
    const regex = /([0-9])\s*-\s*([0-9])/g;
    const replaced = input.replace(regex, '$1–$2'); // Note: Use an en dash character here

    return replaced;
}

function replaceSpacesAroundHyphenWithEnDash(input: string): string {
    const regex = /\s-\s/g;
    const replaced = input.replace(regex, ' – '); // En dash character surrounded by spaces

    return replaced;
}

function replaceLastEWithSupE(input: string): string {
    const regex = /([\s(][IVX][A-Z]*)e\s/;
    const replaced = input.replace(regex, '$1<sup>e</sup> ');

    return replaced;
}

  function replaceSemicolonWithPeriod(input: string): string {
    const regex = /\s;\s/g;
    const replaced = input.replace(regex, '. ');

    return replaced;
}

 function removeColonAfterQuestionmark(input: string): string {
    const regex = /\?:/;
    const replaced = input.replace(regex, '?');

    return replaced;
}

export function removeParenthesesContent(input: string): string {
    const regex = /\(.*\)/g;
    const replaced = input.replace(regex, '');

    return replaced;
}

export function fixTitle(input: string): string{
    return replaceSpacesAroundHyphenWithEnDash(replaceDashesWithEnDash(replaceLastEWithSupE(replaceSemicolonWithPeriod(removeColonAfterQuestionmark(input)))))
}