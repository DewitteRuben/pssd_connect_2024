export type URLSafeStringOptions = {
  maxLen: number;
  lowercaseOnly: boolean;
  regexRemovePattern: RegExp;
  joinString: string;
  trimWhitespace: boolean;
} & Record<string, any>;

export class UrlSafeString {
  private _opts: URLSafeStringOptions = {
    maxLen: 100, // truncates beyond maxLen
    lowercaseOnly: true,
    regexRemovePattern: /((?!([a-z0-9])).)/gi, // matches opposite of [a-z0-9]
    joinString: "-", // e.g. - may be: '-', '_', '#'
    trimWhitespace: true,
  };

  constructor(options?: URLSafeStringOptions) {
    if (options) {
      for (const prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
          this._opts[prop] = options[prop];
        }
      }
    }
  }

  sanitize(...args: any[]) {
    const reJoinString = new RegExp(this._opts.joinString + "+", "g");
    const argsCopy = args.slice();

    let tag;

    if (!argsCopy || argsCopy.length === 0)
      throw new Error("generate method must be passed at least one argument");

    // Validate, trim all arguments:
    for (let i = 0; i < argsCopy.length; i++) {
      if (typeof argsCopy[i] !== "string")
        throw new Error("all supplied arguments must be Strings");

      if (this._opts.trimWhitespace) argsCopy[i] = argsCopy[i].trim();
    }

    // Join strings and convert whitespace between words to join string
    tag = argsCopy.join(this._opts.joinString);
    tag = tag.replace(/\s/g, this._opts.joinString);
    if (this._opts.lowercaseOnly) tag = tag.toLowerCase();
    // Regex away anything "unsafe", but ignore the join string!
    tag = tag.replace(this._opts.regexRemovePattern, (match) => {
      if (match === this._opts.joinString) return match;

      return "";
    });

    // Truncate in excess of maxLen
    if (tag.length > this._opts.maxLen) tag = tag.substring(0, this._opts.maxLen);

    // Remove any duplicates of the join string using this pattern: /<join string>+/g
    tag = tag.replace(reJoinString, this._opts.joinString);

    return tag;
  }
}
