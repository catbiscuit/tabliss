// For mounting the result
declare global {
  interface Window {
    baidu?: {
      sug: (data: SuggestionsResultBaidu) => void;
    };
  }
}

type SuggestionsResultBaidu = {q:string, p:boolean, s:string[]};

export function getSuggestionsBaidu(query: string, engineUrl: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    if (!window.baidu){
      window.baidu = { sug: () => {} };
    }

    if (!window.baidu) {
      reject(new Error('baidu function is not defined'));
      return;
    }

    if (!window.baidu.sug) {
      reject(new Error('baidu sug function is not defined'));
      return;
    }

    const id = `suggestionsQuery${Math.random().toString(36).slice(2)}`;

    window.baidu.sug = (data: SuggestionsResultBaidu) => {
      if (data && Array.isArray(data.s)) {
        resolve(data.s);
      } else {
        reject(new Error('Invalid data format'));
      }

      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };

    const scriptToAdd = document.createElement("script");
    scriptToAdd.id = id;
    scriptToAdd.onerror = (e) => reject(e);
    scriptToAdd.src = engineUrl.replace("searchTerms", encodeURIComponent(query));

    document.head.appendChild(scriptToAdd);
  });
}
