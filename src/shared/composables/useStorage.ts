export function useStorage() {
  const getStorage = ({
    storage_name,
    storage_type = "string",
  }: {
    storage_name: string;
    storage_type?: "string" | "object" | "array";
  }): string | object | any[] | null => {
    const stored_data = localStorage.getItem(storage_name);

    if (!stored_data) return null;

    switch (storage_type) {
      case "string":
        return stored_data;

      case "object":
      case "array":
        try {
          return JSON.parse(stored_data);
        } catch (error) {
          console.error(
            `❌ Failed to parse stored data for "${storage_name}":`,
            error
          );
          return null;
        }

      default:
        return stored_data;
    }
  };

  const setStorage = ({
    storage_name,
    storage_value,
    storage_type = "string",
  }: {
    storage_name: string;
    storage_value: string | number | object | any[];
    storage_type?: "string" | "object" | "array";
  }): void => {
    try {
      if (storage_type === "string") {
        localStorage.setItem(storage_name, storage_value as string);
      } else {
        localStorage.setItem(storage_name, JSON.stringify(storage_value));
      }
    } catch (error) {
      console.error(`❌ Failed to set storage for "${storage_name}":`, error);
    }
  };

  const removeStorage = (storage_name: string): void => {
    try {
      localStorage.removeItem(storage_name);
    } catch (error) {
      console.error(
        `❌ Failed to remove storage for "${storage_name}":`,
        error
      );
    }
  };

  return {
    getStorage,
    setStorage,
    removeStorage,
  };
}
