import { JSONTemplate } from "modloader64_api/JSONTemplate";
import * as API from '../API/Imports';
import { Inventory } from './Inventory';
import IMemory from "modloader64_api/IMemory";
import { ShieldsEquipment } from './ShieldsEquipment';
import { SwordsEquipment } from './SwordsEquipment';
import { DungeonItemManager } from "./DungeonItemManager";
import { QuestStatus } from "./QuestStatus";
import { KeyManager } from "./KeyManager";
import { IModLoaderAPI, ILogger } from "modloader64_api/IModLoaderAPI";

export class SaveContext extends JSONTemplate implements API.ISaveContext {
    
    private emulator: IMemory;
    offsets: API.MMOffsets = new API.MMOffsets();
    inventory: Inventory;
    questStatus: API.IQuestStatus;
    keyManager: API.IKeyManager;
    dungeonItemManager: API.IDungeonItemManager;
    
    constructor(emu: IMemory, log: ILogger) {
        super();
        this.emulator = emu;
        this.swords = new SwordsEquipment(emu);
        this.shields = new ShieldsEquipment(emu);
        this.inventory = new Inventory(emu, log);
        this.questStatus = new QuestStatus(emu);
        this.keyManager = new KeyManager(emu);
        this.dungeonItemManager = new DungeonItemManager(emu);
    }

    swords: SwordsEquipment;
    shields: ShieldsEquipment;
    
    get checksum(): number {
        return this.emulator.rdramReadBuffer(this.offsets.checksum, 0x6).readUIntBE(0x0, 0x6);
    }

    get form(): number {
        return this.emulator.rdramRead8(this.offsets.save_context + this.offsets.mask_offset);
    }

    get max_heart(): number {
        return this.emulator.rdramRead16(this.offsets.max_heart_flag);
    }

    set get_heart(flag: number) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    
    get hearts(): number {
        return this.emulator.rdramRead16(this.offsets.hearts);
    }
    
    set hearts(flag: number) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }

    get deku_b_state(){
        return this.emulator.rdramRead32(this.offsets.deku_b_addr);
    }

    set deku_b_state(flag: number) {
        this.emulator.rdramWrite32(this.offsets.deku_b_addr, flag);
    }

    get magic(): number {
        return this.emulator.rdramRead8(this.offsets.magic);
    }

    set magic(flag: number) {
        this.emulator.rdramWrite16(this.offsets.magic, flag);
    }

    get magic_meter_size(): API.Magic {
        return this.emulator.rdramRead8(this.offsets.magic_meter_size_addr);
    }

    // Several things need to be set in order for magic to function properly.
    set magic_meter_size(size: API.Magic) {
        this.emulator.rdramWrite8(this.offsets.magic_meter_size_addr, size);
        switch (size) {
        case API.Magic.NONE: {
            this.emulator.rdramWrite8(this.offsets.magic_flag_1_addr, 0);
            this.emulator.rdramWrite8(this.offsets.magic_flag_2_addr, 0);
            this.emulator.rdramWrite16(this.offsets.magic_limit_addr, API.MagicQuantities.NONE);
            this.magic_current = API.MagicQuantities.NONE;
            break;
        }
        case API.Magic.NORMAL: {
            this.emulator.rdramWrite8(this.offsets.magic_flag_1_addr, 1);
            this.emulator.rdramWrite8(this.offsets.magic_flag_2_addr, 0);
            this.emulator.rdramWrite16(
                this.offsets.magic_limit_addr,
                API.MagicQuantities.NORMAL
            );
            break;
        }
        case API.Magic.EXTENDED: {
            this.emulator.rdramWrite8(this.offsets.magic_flag_1_addr, 1);
            this.emulator.rdramWrite8(this.offsets.magic_flag_2_addr, 1);
            this.emulator.rdramWrite16(
                this.offsets.magic_limit_addr,
                API.MagicQuantities.EXTENDED
            );
            break;
        }
        }
    }
    
    get magic_current(): number {
        return this.emulator.rdramRead8(this.offsets.magic_current_addr);
    }
  
    set magic_current(amount: number) {
        this.emulator.rdramWrite8(this.offsets.magic_current_addr, amount);
    }

    get owl_statues(): number {
        return this.emulator.rdramRead16(this.offsets.owl_statues);
    }

    set owl_statues(flag: number) {
        this.emulator.rdramWrite16(this.offsets.owl_statues, flag);
    }

    get tunic_boots(): number {
        return this.emulator.rdramRead8(this.offsets.tunic_boots);
    }

    set tunic_boots(flag: number) {
        this.emulator.rdramWrite8(this.offsets.tunic_boots, flag);
    }

    get sword_sheild(): number {
        return this.emulator.rdramRead8(this.offsets.sword_sheild);
    }

    set sword_sheild(flag: number) {
        this.emulator.rdramWrite8(this.offsets.sword_sheild, flag);
    }

    get item_inventory(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.inventory, 0x30);
    }

    set item_inventory(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.inventory, flag);
    }

    get masks(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.masks, 0x18);
    }

    set masks(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.masks, flag);
    }

    get item_amts(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.item_amts, 0x18);
    }

    set item_amts(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.item_amts, flag);
    }

    get updrades(): number {
        return this.emulator.rdramRead32(this.offsets.upgrades);
    }
    
    set updrades(flag: number) {
        this.emulator.rdramWrite32(this.offsets.upgrades, flag);
    }

    get questflg1(): number {
        return this.emulator.rdramRead8(this.offsets.questflg1);
    }

    set questflg1(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg1, flag);
    }

    get questflg2(): number {
        return this.emulator.rdramRead8(this.offsets.questflg2);
    }

    set questflg2(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg2, flag);
    }

    get questflg3(): number {
        return this.emulator.rdramRead8(this.offsets.questflg3);
    }

    set questflg3(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get questflg4(): number {
        return this.emulator.rdramRead8(this.offsets.questflg4);
    } 

    set questflg4_flag(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get dungeon_flg(): Buffer {
       return this.emulator.rdramReadBuffer(this.offsets.dungeon_flg, 0xA);
    }

    set dungeon_flg(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.dungeon_flg, flag);
    }
    
    get double_defense(): number {
        return this.emulator.rdramRead8(this.offsets.double_defense);
    }

    set double_defense(flag: number) {
        this.emulator.rdramWrite8(this.offsets.double_defense, flag);
    }

    get scene_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.scene_flags, 0xD20);
    }

    set scene_flags(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }

    get event_flags(): Buffer { 
        return this.emulator.rdramReadBuffer(this.offsets.event_inf, 0x8);
    }

    set event_flags(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.event_inf, flag);
    }

    /*get item_Flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.inventory, 0x18);
    }

    set item_Flags(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.inventory, flag);
    }*/

    get heart_containers(): number {
        return this.emulator.rdramRead16(this.offsets.max_heart_flag);
    }

    set heart_containers(flag: number) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    
    get bank_rupees(): number {
        return this.emulator.rdramRead16(this.offsets.bank_rupees);
    }

    set bank_rupees(flag: number) {
        this.emulator.rdramWrite16(this.offsets.bank_rupees, flag);
    }

    get liveSceneData_chests(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.chest_flags_addr,
            0x4
        );
    }
    set liveSceneData_chests(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.chest_flags_addr,
            buf
        );
    }
    get liveSceneData_clear(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.room_clear_flags_addr,
            0x4
        );
    }
    set liveSceneData_clear(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.room_clear_flags_addr,
            buf
        );
    }
    get liveSceneData_switch(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.switch_flags_addr,
            0x4
        );
    }
    set liveSceneData_switch(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.switch_flags_addr,
            buf
        );
    }
    get liveSceneData_temp(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.temp_switch_flags_addr,
            0x4
        );
    }
    set liveSceneData_temp(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            this.offsets.global_context_pointer,
            this.offsets.temp_switch_flags_addr,
            buf
        );
    }
}